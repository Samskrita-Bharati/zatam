import React, { createContext, useCallback, useState } from "react";
import { baseUrl, postRequest } from "../Services/UserService";
import { googleSignIn } from "../Services/GoogleServices";
import { toast } from "react-toastify";

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
          `${baseUrl}/api/users/register`,
          JSON.stringify(registrationInfo)
        );

        setIsRegisterLoading(false);

        if (response.error) {
          return setRegistrationError(response);
        } else {
          localStorage.setItem("User", JSON.stringify(response));
          setUser(response);
          toast.success("");
          setRegistationInfo({
            name: "",
            email: "",
            password: "",
          });
          return response;
        }
      } catch (err) {
        setIsRegisterLoading(false);
        setRegistrationError(null);
        console.error("Registration Error", err);
        return { error: true, message: "Unexpected error occurred" };
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
        `${baseUrl}/api/users/login`,
        JSON.stringify(loginInfo)
      );

      setIsLogInLoading(false);
      if (response.error) {
        toast.error(response.message);
        return setLogInError(response);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
      const userName = response.userName;
      toast.success(`Login Successful!\nWelcome ${userName}`);
      setLogInInfo({
        emailAddress: "",
        password: "",
      });
      return response;
    },
    [loginInfo]
  );

  const logOutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  const googleLogin = () => {
    googleSignIn(setUser);
  };

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
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
