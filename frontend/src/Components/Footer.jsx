import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { RiTelegram2Line } from "react-icons/ri";
import { GrInstagram } from "react-icons/gr";
import { FiTwitter, FiYoutube } from "react-icons/fi";
import { FaGamepad, FaFacebookF, FaLinkedin } from "react-icons/fa";
import { GiHomeGarage } from "react-icons/gi";
import { GiTrophyCup } from "react-icons/gi";
import { RiDashboard2Line } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { MdAttachEmail } from "react-icons/md";
import { FcCellPhone } from "react-icons/fc";

import Button from "../UIComponents/Button";

const Footer = () => {
  return (
    <>
      <div className="bg-opacity-50 mr-0.5 ml-0.5 mt-1 rounded-2xl grid grid-cols-2 grid-rows-4 sm:grid-cols-2 sm:grid-rows-none">
        {/* Social Media Section */}
        <div className="row-span-2 m-1 flex flex-col justify-center">
          <p className="font-serif text-center sm:text-sm md:text-base dark:text-gray-300">
            Connect with us...
          </p>
          <div className="flex flex-wrap justify-center">
            {[
              {
                icon: (
                  <FaFacebookF className="text-blue-800 dark:text-zinc-700 dark:hover:text-blue-800" />
                ),
                label: "Facebook",
                to: "https://www.facebook.com/SamskritaBharatiUS",
              },

              {
                icon: (
                  <RiTelegram2Line className="text-[#0088cc] dark:hover:text-[#0088cc] dark:text-zinc-700" />
                ),
                label: "Telegram",
                to: "https://t.me/samskritabharati",
              },
              {
                icon: (
                  <GrInstagram className="text-[#fa7e1e] dark:hover:text-[#fa7e1e] dark:text-zinc-700" />
                ),
                label: "Instagram",
                to: "https://www.instagram.com/samskritabharatiusa/",
              },
              {
                icon: (
                  <FiTwitter className="text-[#1DA1F2] dark:hover:text-[#1DA1F2] dark:text-zinc-700" />
                ),
                label: "Twitter",
                to: "https://x.com/samskritam",
              },
              {
                icon: (
                  <FiYoutube className="text-[#FF0000] dark:hover:text-[#FF0000] dark:text-zinc-700" />
                ),
                label: "Youtube",
                to: "https://www.youtube.com/@SamskritaBharatiUSA",
              },
              {
                icon: (
                  <FaLinkedin className="text-[#0077B5] dark:hover:text-[#0077B5] dark:text-zinc-700" />
                ),
                label: "Linkedin",
                to: "https://www.linkedin.com/company/samskrita-bharati/",
              },
            ].map((item, index) => (
              <div className="relative group m-1" key={index}>
                <Link to={item.to} target="blank">
                  <Button
                    buttonWidth="w-10"
                    buttonHeight="h-10"
                    darkBackgroundProp="dark:text-amber-500"
                    hoverProperties="hover:text-violet-500"
                    icon={item.icon}
                    margin="mr-2"
                  />
                  <span className="absolute left-full bottom-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 italic tracking-[1.75px]">
                    {item.label}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* Quick Links */}
        <div className="row-span-2 m-1 flex flex-col flex-wrap justify-center">
          <p className="font-serif text-center sm:text-sm md:text-base dark:text-gray-300">
            Quick Links:
          </p>
          <div className="flex flex-wrap justify-center">
            {[
              {
                icon: (
                  <GiHomeGarage className="text-amber-400 dark:text-zinc-700 dark:hover:text-amber-400" />
                ),
                label: "Home",
                to: "/",
              },
              {
                icon: (
                  <FaGamepad className="dark:text-zinc-700 dark:hover:text-indigo-600 text-indigo-600" />
                ),
                label: "Games",
                to: "/games",
              },
              {
                icon: (
                  <GiTrophyCup className="text-amber-500 dark:text-zinc-700 dark:hover:text-amber-500" />
                ),
                label: "Leaderboard",
                to: "/leaderboard",
              },
              {
                icon: (
                  <RiDashboard2Line className="text-[#2c3e50] dark:hover:text-[#2c3e50] dark:text-zinc-700" />
                ),
                label: "Dashboard",
                to: "/dashboard",
              },
              {
                icon: (
                  <VscFeedback className="text-green-400 dark:hover:text-green-400 dark:text-zinc-700" />
                ),
                label: "Feedback",
                to: "/aboutus",
              },
            ].map((item, index) => (
              <div className="relative group m-1" key={index}>
                <Link to={item.to}>
                  <Button
                    buttonWidth="w-10"
                    buttonHeight="h-10"
                    icon={item.icon}
                    margin="mr-2"
                  />
                </Link>
                <span className="absolute left-1/2 bottom-1/2 -translate-y-1/4 ml-1 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 italic tracking-[1.75px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Contact Us Row (Spans both columns) */}
        <div className="col-span-2 flex flex-col items-center mb-5">
          <p className="text-base font-serif dark:text-gray-300">Contact Us</p>
          <div className="flex flex-wrap justify-center">
            {[
              {
                icon: (
                  <FaWhatsapp className="text-green-500 dark:text-zinc-700 dark:hover:text-green-500" />
                ),
                label: "Whatsapp (240)449-0201",
                to: "https://wa.me/12404490201",
              },
              { icon: <FcCellPhone />, label: "Phone", to: "/" },
              {
                icon: (
                  <MdAttachEmail className="text-sky-600 dark:text-zinc-700 dark:hover:text-sky-600 hover:scale-105" />
                ),
                label: "Email",
                to: "mailto:code@samskritabharati.ca",
              },
            ].map((item, index) => (
              <div className="relative group m-1" key={index}>
                <Link to={item.to} target="blank">
                  <Button icon={item.icon} margin="m-5" />
                  <span className="absolute top-1/2 left-1/2 translate-y-1/2 ml-1 px-1 py-1 text-[10px] text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 italic tracking-[1.75px]">
                    {item.label}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* Copyright */}
      </div>
      <div className="flex items-center justify-center m-.50 h-full">
        <p className="text-[12px] text-gray-950 dark:text-gray-400 font-serif italic">
          &copy; {new Date().getFullYear()} Samskrita Bharati. All rights
          reserved.
        </p>
      </div>
    </>
  );
};

export default Footer;
