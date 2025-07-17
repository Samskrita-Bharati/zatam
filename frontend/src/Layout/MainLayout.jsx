import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";
import { IoIosSunny, IoIosMoon } from "react-icons/io";
import DarkBackground from "../Backgrounds/DarkBackground";

const MainLayout = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = (toDark) => {
    if (toDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    }
  };

  return (
    <div
      className={`relative  overflow-x-hidden ${
        !isDark ? "bg-gary-50" : ""
      }`}
    >
      {isDark && <DarkBackground />}

      <div className="flex justify-end mr-1 z-10 relative ">
        <div className="bg-zinc-400 dark:bg-zinc-700 p-2 rounded-xl flex w-[100px] h-10 items-center m-1 justify-around">
          {/* Light Mode Button */}
          <div className="relative group">
            <button
              onClick={() => toggleTheme(false)}
              className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-100/10 rounded-xl text-black dark:text-white"
            >
              <IoIosSunny />
            </button>
            <span className="absolute top-9/8 right-9/16 -translate-y-1/5 mb-1 px-2 py-1 text-[10px] text-gray-400 bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 italic tracking-wider">
              Light Mode
            </span>
          </div>

          {/* Dark Mode Button */}
          <div className="relative group">
            <button
              onClick={() => toggleTheme(true)}
              className="bg-transparent p-3 hover:bg-zinc-200 dark:hover:bg-zinc-100/10 rounded-xl text-black dark:text-white cursor-pointer"
            >
              <IoIosMoon />
            </button>
            <span className="absolute top-9/8 right-9/16 -translate-y-1/5 mb-1 px-2 py-1 text-[10px] text-gray-400 bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 italic tracking-wider cursor-pointer">
              Dark Mode
            </span>
          </div>
        </div>
      </div>

      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
