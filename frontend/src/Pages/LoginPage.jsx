import React, { useContext } from "react";
import InputBox from "../UIComponents/InputBox";
import Button from "../UIComponents/Button";
import { FcGoogle } from "react-icons/fc";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    loginUser,
    updateLogInInfo,
    loginError,
    isLoginLoading,
    loginInfo,
    googleLogin,
  } = useContext(AuthContext);

  const { emailAddress, password } = loginInfo;

  const handleLogin = () => {
    if (!emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      alert("Invalid Email Address");
      return;
    } else if (
      !password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        .test
    ) {
      alert("Invalid Password");
    }

    loginUser();
    navigate("/test");
  };

  const handleGoogleSignIn = () => {
    googleLogin();

    navigate("/test");
  };

  return (
    <div className="min-h-[75vh] w-full flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full shadow-lg rounded-lg overflow-hidden">
        {/* Left: Image */}
        <div className="flex justify-center items-center p-4">
          <img
            onClick={() => console.log("Hello")}
            src="/data/images/loginpageimage.jpg"
            alt="login"
            className="w-56 h-64 md:w-96 md:h-96 object-contain"
          />
        </div>

        {/* Right: Sign-Up Form */}
        <div className="flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 dark:text-white font-serif">
            Login
          </h2>
          <div>
            <InputBox
              label="Email Address"
              type="email"
              name="emailAddress"
              onChange={(e) =>
                updateLogInInfo({ ...loginInfo, emailAddress: e.target.value })
              }
              value={loginInfo.emailAddress}
            />
            <InputBox
              label="Password"
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={(e) => {
                updateLogInInfo({ ...loginInfo, password: e.target.value });
              }}
            />
          </div>
          <Button
            buttonWidth="w-36"
            buttonHeight="h-12"
            darkBackgroundProp="dark:bg-zinc-400"
            lightBackgroundProp="bg-zinc-400"
            buttonLabel={isLoginLoading ? "Getting You In" : "login"}
            margin="mt-5 mb-5 text-black"
            hoverProperties="hover:italic hover:text-zinc-600"
            onClick={handleLogin}
          />

          {loginError?.error && (
            <span className="text-red-400">
              <p>{loginError?.message}</p>
            </span>
          )}
          <Button
            buttonWidth="w-56"
            buttonHeight="h-12"
            darkBackgroundProp="dark:bg-zinc-400"
            lightBackgroundProp="bg-zinc-400"
            buttonLabel="Login using"
            margin=" mb-5 text-black"
            icon={<FcGoogle className="h-8" />}
            hoverProperties="hover:italic hover:text-zinc-600"
            onClick={handleGoogleSignIn}
          />
        </div>
        <h3 className="flex justify-center mb-5 font-serif tracking-[1.25px] italic">
          Create a new account by
          <NavLink to="/signup">
            <span className="ml-2 hover:uppercase underline hover:text-sky-700 underline-offset-8">
              signing up
            </span>
          </NavLink>
        </h3>
      </div>
    </div>
  );
};

export default LoginPage;
