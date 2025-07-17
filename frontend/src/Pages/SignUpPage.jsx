import React from "react";
import InputBox from "../UIComponents/InputBox";
import Button from "../UIComponents/Button"
import { FcGoogle } from "react-icons/fc";


const SignUpPage = () => {
  return (
    <div className="min-h-[75vh] w-full flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full shadow-lg rounded-lg overflow-hidden">
        {/* Left: Image */}
        <div className="flex justify-center items-center p-4">
          <img
            onClick={() => console.log("Hello")}
            src="/data/images/lordganesha.png"
            alt="Sign Up"
            className="w-56 h-64 md:w-96 md:h-96 object-contain"
          />
        </div>

        {/* Right: Sign-Up Form */}
        <div className="flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800 dark:text-white font-serif">
            Sign Up
          </h2>
          <div>
            <InputBox label="Display Name" />
            <InputBox label="Email Address" />
            <InputBox label="Password" />
            <InputBox label="Confirm Password" />
          </div>

          <Button
            buttonWidth="w-36"
            buttonHeight="h-12"
            darkBackgroundProp="dark:bg-zinc-400"
            lightBackgroundProp="bg-zinc-400"
            buttonLabel="register"
            margin="mt-5 mb-5 text-black"
            hoverProperties="hover:italic hover:text-zinc-600"
          />
          <Button
            buttonWidth="w-56"
            buttonHeight="h-12"
            darkBackgroundProp="dark:bg-zinc-400"
            lightBackgroundProp="bg-zinc-400"
            buttonLabel="register using"
            margin=" mb-5 text-black"
            icon={<FcGoogle className="h-8" />}
            hoverProperties="hover:italic hover:text-zinc-600"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
