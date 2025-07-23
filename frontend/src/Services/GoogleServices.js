import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/FirebaseConfig"; // Make sure this is the correct path to your initialized Firebase app

export const baseUrl = "http://localhost:5000/api";

export const googleSignIn = async () => {
  const auth = getAuth(app); // You need to pass the initialized app
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const tokenID = await result.user.getIdToken();
    console.log("Token ID:", tokenID);
    // optionally return result or tokenID
    return tokenID;
  } catch (err) {
    console.error("Google Sign-in failed:", err);
  }
};
