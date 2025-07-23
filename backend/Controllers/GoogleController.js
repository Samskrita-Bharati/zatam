const { getFirestore } = require("firebase-admin/firestore");
const { get } = require("../Routes/GoogleRoutes");

const admin = require("firebase-admin");
const db = getFirestore();
const usersCollection = db.collection("users");

const logInUsingGoogle = async (req, res) => {
  try {
    const { googleToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(googleToken);
    const { uid, email, name, picture } = decodedToken;
    console.log("UserId", uid);
    console.log("Email", email);
    console.log("Name", name);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  logInUsingGoogle,
};
