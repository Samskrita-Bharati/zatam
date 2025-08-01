const admin = require("firebase-admin");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const getDateTimeParts = require("../utils/DateTimeService");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/Email");
const crypto = require("crypto");

const db = getFirestore();
const usersCollection = db.collection("users");

// Function to create JWT
const createToken = ({ _id, userName, emailAddress }) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  if (!jwtkey) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  return jwt.sign({ _id, userName, emailAddress }, jwtkey, {
    expiresIn: "30d",
  });
};

//Function to create password reset token using crypto
const resetPasswordToken = () => {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token to store securely
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiry to 15 minutes from now
  const passwordResetTokenExpiry = new Date(
    Date.now() + 15 * 60 * 1000
  ).toISOString();
  return {
    resetToken, // Plain token to send to user via email
    passwordResetToken, // Hashed token to store in DB
    passwordResetTokenExpiry,
  };
};

// function to sign up new a user using our sign up logic
const registerNewUser = async (req, res) => {
  try {
    const { formattedId } = getDateTimeParts("U");
    const { userName, emailAddress, password } = req.body;

    if (!userName || !emailAddress || !password) {
      return res.status(404).json({ message: "All Fields are Required." });
    }

    const existingUserNameSnapShot = await usersCollection
      .where("userName", "==", userName.toLowerCase().trim())
      .get();

    if (!existingUserNameSnapShot.empty) {
      return res.status(400).json({ message: "User Name Already Taken." });
    }

    const existingUserSnapShot = await usersCollection
      .where("emailAddress", "==", emailAddress)
      .get();

    if (!existingUserSnapShot.empty) {
      return res.status(400).json({ message: "Email Already Registered." });
    }

    const newUser = await User.create({
      userName: userName,
      emailAddress: emailAddress,
      password: password,
    });

    await usersCollection.doc(formattedId).set(newUser.toFirestore());

    return res
      .status(201)
      .json({ message: `User with Id: ${formattedId} Successfully Added` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// function to login a user using our logic

const logInUser = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    // Step 1: Query Firestore for the user with this email
    const querySnapshot = await usersCollection
      .where("emailAddress", "==", emailAddress.toLowerCase().trim())
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res.status(400).json({ message: "Email not found" });
    }

    const doc = querySnapshot.docs[0];
    const userData = doc.data();

    // Step 2: Check password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Step 3: Generate token
    const token = createToken({
      _id: doc.id,
      userName: userData.userName,
      emailAddress: userData.emailAddress,
    });

    //update lastLogin
    await usersCollection.doc(doc.id).update({
      lastLogin: new Date().toISOString(),
    });

    return res.status(200).json({
      message: "Login successful",
      userId: doc.id,
      userName: userData.userName,
      token,
      role: userData.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { emailAddress } = req.body;
    if (!emailAddress) {
      return res.status(400).json({ message: "Email is Required" });
    }

    const querySnapshot = await usersCollection
      .where("emailAddress", "==", emailAddress)
      .get();

    if (querySnapshot.empty) {
      return res.status(404).json({ message: "Email Address not found." });
    }

    const doc = querySnapshot.docs[0];
    const userData = doc.data();

    const { resetToken, passwordResetToken, passwordResetTokenExpiry } =
      resetPasswordToken();

    await usersCollection.doc(doc.id).update({
      passwordResetToken: passwordResetToken,
      passwordResetTokenExpiry: passwordResetTokenExpiry,
    });
    // Sending the token back to the user email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis above link will only be valid for 15 Minutes`;

    try {
      await sendEmail({
        emailAddress: userData.emailAddress,
        subject: "Password change request received",
        message: message,
      });

      return res
        .status(200)
        .json({ message: "Password reset Link succesfully sent." });
    } catch (error) {
      await usersCollection.doc(doc.id).update({
        passwordResetToken: FieldValue.delete(),
        passwordResetTokenExpiry: FieldValue.delete(),
      });

      return res.status(500).json({ message: error.message });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!token) {
      return res.status(400).json({ message: "Invalid Request" });
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const querySnapshot = await usersCollection
      .where("passwordResetToken", "==", hashedToken)
      .where("passwordResetTokenExpiry", ">", new Date().toISOString())
      .get();
    if (querySnapshot.empty) {
      return res.status(400).json({ message: "Invalid or Expired Link" });
    }
    const doc = querySnapshot.docs[0];
    const userData = doc.data();

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    } else if (typeof password !== "string" || !passwordRegex.test(password)) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await usersCollection.doc(doc.id).update({
      password: hashedPassword,
      lastPasswordUpdate: new Date().toISOString(),
      passwordResetToken: FieldValue.delete(),
      passwordResetTokenExpiry: FieldValue.delete(),
      lastLogin: new Date().toISOString(),
    });

    const jwtToken = createToken({
      _id: doc.id,
      userName: userData.userName,
      emailAddress: userData.emailAddress,
    });

    return res.status(200).json({
      message: "Password Reset Sucessful",
      userId: doc.id,
      userName: userData.userName,
      jwtToken,
      role: userData.role,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerNewUser,
  logInUser,
  forgotPassword,
  resetPassword,
};
