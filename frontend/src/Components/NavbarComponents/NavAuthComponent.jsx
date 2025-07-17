import React from "react";
import { NavLink } from "react-router-dom";

const NavAuthComponent = () => {
  const authList = [
    { labelName: "Sign-up", pageLink: "/signup" },
    { labelName: "Log In", pageLink: "/login" },
    { labelName: "Log Out",pageLink:"/logout" },
  ];
  return (
    <div className="flex mr-2 p-2">
      <ul className="flex flex-col gap-3 font-serif">
        {authList.map((item, index) => (
          <NavLink to={item.pageLink} key={index}>
            <li className="dark:bg-zinc-700 bg-indigo-200 dark:text-zinc-400 rounded-lg flex justify-center p-1 hover:text-gray-100 hover:underline dark:hover:text-scale-105 ">
              {item.labelName}
            </li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default NavAuthComponent;
