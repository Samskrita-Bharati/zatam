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

  const [loginError, setLogInError] = useState(null);
  const [isLoginLoading, setIsLogInLoading] = useState(false);
  const [loginInfo, setLogInInfo] = useState({
    emailAddress: "",
    password: "",
  });

  const updateRegistrationInfo = useCallback((info) => {
    setRegistationInfo(info);
  }, []);

  const updateLogInInfo = useCallback((info) => {
    setLogInInfo(info);
  }, []);
  const registerUser = useCallback(
    async (e) => {
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
    },
    [registrationInfo]
  );

  const loginUser = useCallback(
    async (e) => {
      if (e) {
        e.preventDefault();
      }
      setIsLogInLoading(true);
      setLogInError(null);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );

      console.log("Response", response);

      setIsLogInLoading(false);
      if (response.error) {
        return setLogInError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
      setLogInInfo({
        emailAddress: "",
        password: "",
      });
      
    },
    [loginInfo]
  );

  const logOutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registrationInfo,
        registerUser,
        registrationError,
        isRegisterLoading,
        updateRegistrationInfo,
        loginUser,
        updateLogInInfo,
        loginError,
        isLoginLoading,
        loginInfo,
        logOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
