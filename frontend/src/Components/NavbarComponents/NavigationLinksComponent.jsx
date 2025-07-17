import { useState } from "react";
import { FaGamepad } from "react-icons/fa";
import { GiHomeGarage } from "react-icons/gi";
import { GiTrophyCup } from "react-icons/gi";
import { RiDashboard2Line } from "react-icons/ri";
import { VscFeedback } from "react-icons/vsc";
import Button from "../../UIComponents/Button";

const NavigationLinksComponent = () => {
  const navLinkList = [
    {
      linkLabel: "Home",
      iconName: (
        <GiHomeGarage className="text-amber-400 dark:text-zinc-700 dark:hover:text-amber-400" />
      ),
    },
    {
      linkLabel: "Games",
      iconName: (
        <FaGamepad className="dark:text-zinc-700 dark:hover:text-indigo-600 text-indigo-600" />
      ),
    },
    {
      linkLabel: "LeaderBoard",
      iconName: (
        <GiTrophyCup className="text-amber-500 dark:text-zinc-700 dark:hover:text-amber-500" />
      ),
    },
    {
      linkLabel: "Dashboard",
      iconName: (
        <RiDashboard2Line className="text-[#2c3e50] dark:hover:text-[#2c3e50] dark:text-zinc-700" />
      ),
    },
    {
      linkLabel: "Feedback",
      iconName: (
        <VscFeedback className="text-green-400 dark:hover:text-green-400 dark:text-zinc-700" />
      ),
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null); // Track active index

  return (
    <div className="flex flex-col items-center justify-center flex-grow mr-20 bg-transparent">
      {/* //navbar buttons */}
      <div className="hidden sm:flex transition-all justify-center">
        <ul className="flex gap-5 font-serif text-xl tracking-[1.25px] text-gray-950 dark:text-gray-200">
          {navLinkList.map((item, index) => (
            <li
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`cursor-pointer text-gray-950 transition-colors relative dark:text-gray-400
              ${
                activeIndex === index
                  ? "p-1 rounded-xl animate-pulse underline underline-offset-8 "
                  : ""
              }
              hover:underline hover:underline-offset-8
            `}
            >
              {item.linkLabel}
            </li>
          ))}
        </ul>
      </div>
      {/* // mobile buttons */}
      <div className="flex sm:hidden transition-all justify-cente p-2 p-x-2 border-2">
        {navLinkList.map((items, index) => (
          <div className=" relative group" key={index}>
            <Button icon={items.iconName} margin="mr-10" />
            <span className="absolute left-1/2 bottom-1/2 -translate-y-1/4 ml-1 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 italic tracking-[1.75px]">
              {items.linkLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationLinksComponent;
