import React, { createContext, useCallback, useState } from "react";
import { baseUrl, postRequest } from "../Services/UserService";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registrationError, setRegistrationError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registrationInfo, setRegistationInfo] = useState({
    userName: "",
    emailAddress: "",
    password: "",
  });

  const updateRegistrationInfo = useCallback((info) => {
    setRegistationInfo(info);
  },[]);
  const registerUser = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    setIsRegisterLoading(true);
    setRegistrationError(null);
    try {
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registrationInfo)
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegistrationError(response);
      } else {
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);
        setRegistationInfo({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      setIsRegisterLoading(false);
      setRegistrationError(null);
      console.error("Registration Error", err);
    }
  },[registrationInfo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        registrationInfo,
        registerUser,
        registrationError,
        isRegisterLoading,
        updateRegistrationInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
