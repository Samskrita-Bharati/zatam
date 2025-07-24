export const baseUrl = import.meta.env.VITE_BACKEND_URL;

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/FirebaseConfig"; // Make sure this is the correct path to your initialized Firebase app

export const googleSignIn = async (setUser) => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const tokenID = await result.user.getIdToken();
    const userName = result.user.displayName;
    const emailAddress = result.user.email;
    const password = "@Nepaliketa123"; // Placeholder, or generate a secure value

    const registrationInfo = {
      userName,
      emailAddress,
      password,
      token: tokenID, // optionally send token
    };

    const res = await fetch(`${baseUrl}/api/g-auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationInfo),
    });

    const data = await res.json();

    setUser({
      userId: data.userId,
      userName: data.userName,
      token: data.token,
      role: data.role,
    });

    // Optionally persist in localStorage
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("userName", data.userName);
    localStorage.setItem("userToken", data.token);
    localStorage.setItem("role", data.role);

    console.log("Google Sign-in success:", data);

  } catch (err) {
    console.error("Google Sign-in failed:", err);
  }
};
