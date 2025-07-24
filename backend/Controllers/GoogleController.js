const { getAuth } = require("firebase-admin/auth"); // Make sure you are using firebase-admin

const { getFirestore } = require("firebase-admin/firestore");
const getDateTimeParts = require("../utils/DateTimeService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const admin = require("firebase-admin");
const User = require("../models/User");
const db = getFirestore();
const usersCollection = db.collection("users");

const createToken = ({ _id, userName, emailAddress }) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  if (!jwtkey) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }

  return jwt.sign({ _id, userName, emailAddress }, jwtkey, {
    expiresIn: "30d",
  });
};

const logInUsingGoogle = async (req, res) => {
  try {
    const { formattedId } = getDateTimeParts("U");

    const { userName, emailAddress, password, token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing Token." });
    }

    const decodedToken = await getAuth().verifyIdToken(token);

    if (!decodedToken || decodedToken.email != emailAddress) {
      return res.status(401).json({ message: "Invalid or Mismatched token." });
    }

    const querySnapShot = await usersCollection
      .where("emailAddress", "==", emailAddress)
      .get();

    let finalUserData;
    let userDocId;

    if (!querySnapShot.empty) {
      const doc = querySnapShot.docs[0];
      finalUserData = doc.data();
      userDocId = doc.id;
    } else {
      const newUser = await User.create({
        userName: userName,
        emailAddress: emailAddress,
        password: password,
      });

      await usersCollection.doc(formattedId).set(newUser.toFirestore());
      finalUserData = newUser;
      userDocId = formattedId;
    }
    await usersCollection.doc(userDocId).update({
      lastLogin: new Date().toISOString(),
    });

    const authToken = createToken({
      _id: userDocId,
      userName: finalUserData.userName,
      emailAddress: finalUserData.emailAddress,
    });

    return res.status(200).json({
      message: "Login successful",
      userId: userDocId,
      userName: finalUserData.userName,
      authToken,
      role: finalUserData.role,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  logInUsingGoogle,
};
