import { useLocation, NavLink } from "react-router-dom";
import { FaGamepad } from "react-icons/fa";
import { GiHomeGarage, GiTrophyCup } from "react-icons/gi";
import { RiDashboard2Line } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import Button from "../../UIComponents/Button";

const NavigationLinksComponent = () => {
  const location = useLocation();

  const navLinkList = [
    {
      linkLabel: "Home",
      iconName: (
        <GiHomeGarage className="text-amber-400 dark:text-zinc-700 dark:hover:text-amber-400" />
      ),
      pageLink: "/",
    },
    {
      linkLabel: "Games",
      iconName: (
        <FaGamepad className="dark:text-zinc-700 dark:hover:text-indigo-600 text-indigo-600" />
      ),
      pageLink: "/games",
    },
    {
      linkLabel: "LeaderBoard",
      iconName: (
        <GiTrophyCup className="text-amber-500 dark:text-zinc-700 dark:hover:text-amber-500" />
      ),
      pageLink: "/leaderboard",
    },
    {
      linkLabel: "Dashboard",
      iconName: (
        <RiDashboard2Line className="text-[#2c3e50] dark:hover:text-[#2c3e50] dark:text-zinc-700" />
      ),
      pageLink: "/dashboard",
    },
    {
      linkLabel: "Feedback",
      iconName: (
        <VscFeedback className="text-green-400 dark:hover:text-green-400 dark:text-zinc-700" />
      ),
      pageLink: "/feedback",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center flex-grow mr-20 bg-transparent">
      {/* Desktop navbar */}
      <div className="hidden sm:flex transition-all justify-center">
        <ul className="flex gap-5 font-serif text-xl tracking-[1.25px] text-gray-950 dark:text-gray-200">
          {navLinkList.map((item, index) => (
            <NavLink key={index} to={item.pageLink}>
              <li
                className={`cursor-pointer transition-colors relative
                ${
                  location.pathname === item.pageLink
                    ? "p-1 rounded-xl animate-pulse underline underline-offset-8"
                    : ""
                }
                hover:underline hover:underline-offset-8`}
              >
                {item.linkLabel}
              </li>
            </NavLink>
          ))}
        </ul>
      </div>

      {/* Mobile buttons */}
      <div className="flex sm:hidden transition-all justify-center p-2 border-2">
        {navLinkList.map((item, index) => (
          <div className="relative group" key={index}>
            <NavLink to={item.pageLink}>
              <Button icon={item.iconName} margin="mr-10" />
            </NavLink>
            <span className="absolute left-1/2 bottom-1/2 -translate-y-1/4 ml-1 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 italic tracking-[1.75px]">
              {item.linkLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationLinksComponent;
