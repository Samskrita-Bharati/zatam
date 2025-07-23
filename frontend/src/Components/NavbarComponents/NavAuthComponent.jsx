import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

const NavAuthComponent = () => {
  const { user, logOutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOutUser();
    navigate("/login"); // Redirect to login or homepage after logout
  };

  return (
    <div className="flex mr-2 p-2">
      <ul className="flex flex-col gap-3 font-serif">
        {!user && (
          <>
            <NavLink to="/signup">
              <li className="dark:bg-zinc-700 bg-indigo-200 dark:text-zinc-400 rounded-lg flex justify-center p-1 hover:text-gray-100 hover:underline dark:hover:text-scale-105">
                Sign-up
              </li>
            </NavLink>
            <NavLink to="/login">
              <li className="dark:bg-zinc-700 bg-indigo-200 dark:text-zinc-400 rounded-lg flex justify-center p-1 hover:text-gray-100 hover:underline dark:hover:text-scale-105">
                Log In
              </li>
            </NavLink>
          </>
        )}

        {user && (
          <li
            onClick={handleLogout}
            className="cursor-pointer dark:bg-zinc-700 bg-indigo-200 dark:text-zinc-400 rounded-lg flex justify-center p-1 hover:text-gray-100 hover:underline dark:hover:text-scale-105"
          >
            Log Out
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavAuthComponent;
