const User = require("../models/User");
const { getFirestore } = require("firebase-admin/firestore");
const getDateTimeParts = require("../utils/DateTimeService");
const jwt = require("jsonwebtoken");


const db = getFirestore();
const usersCollection = db.collection("users");

// Function to create JWT
const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "30d" });
};

const registerNewUser = async (req, res) => {
  try {
    const { formattedId } = getDateTimeParts("U");
    const { userName, emailAddress, password } = req.body;

    const existingUserSnapShot = await usersCollection
      .where("emailAddress", "==", emailAddress)
      .get();

    if (!existingUserSnapShot.empty) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const newUser = await User.create({
      userName: userName,
      emailAddress: emailAddress,
      password: password,
      role: ["user"],
    });

    await usersCollection.doc(formattedId).set(newUser.toFirestore());

    return res
      .status(201)
      .json({ message: `User with Id: ${formattedId} Successfully Added` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerNewUser,
};
