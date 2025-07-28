const User = require("../models/User");
const bcrypt = require("bcrypt");
const { getFirestore } = require("firebase-admin/firestore");
const getDateTimeParts = require("../utils/DateTimeService");
const jwt = require("jsonwebtoken");

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

    if (!userName || !password) {
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

module.exports = {
  registerNewUser,
  logInUser,
  
};
