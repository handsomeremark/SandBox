import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import chartFillIcon from "../Images/Chart_fill.png";
import userIcon from "../Images/User.png";
import settingIcon from "../Images/Setting.png";
import logo from "../Images/download.png";
import searchIcon from "../Images/Search.png";
import controlIcon from "../Images/control.png";
import logoutIcon from "../Images/logout.png";

const SideBar = ({ onSectionChange }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const Menus = [
    { title: "Dashboard", src: chartFillIcon },
    { title: "Users", src: userIcon },
    { title: "Setting", src: settingIcon },
    { title: "Search", src: searchIcon },
  ];

  const handleMenuClick = (menuTitle) => {
    if (menuTitle === "Logout") {
      handleLogout();
    } else {
      setActiveSection(menuTitle);
      onSectionChange(menuTitle); 
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      className={` ${
        sidebarOpen ? "w-72" : "w-20"
      } bg-gray-800 h-screen p-5 pt-8 relative duration-300 flex flex-col justify-between`}
    >
      <div>
        <img
          src={controlIcon}
          alt="Toggle Sidebar"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-800
      border-2 rounded-full ${!sidebarOpen && "rotate-180"}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex gap-x-4 items-center">
          <img
            src={logo}
            alt="Admin Logo"
            className={`cursor-pointer duration-500 ${
              sidebarOpen && "rotate-[360deg]"
            }`}
          />
        </div>
        {/*icons*/}
        <ul className="pt-6 flex flex-col gap-y-2">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm items-center gap-x-4 ${
                activeSection === Menu.title && "bg-gray-700"
              }`}
              onClick={() => handleMenuClick(Menu.title)}
            >
              <img src={Menu.src} alt={Menu.title} className="w-6 h-6" />
              <span
                className={`${
                  !sidebarOpen && "hidden"
                } origin-left duration-200`}
              >
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <li
          className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm items-center gap-x-4 ${
            activeSection === "Logout" && "bg-gray-700"
          }`}
          onClick={() => handleMenuClick("Logout")}
        >
          <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
          <span
            className={`${
              !sidebarOpen && "hidden"
            } origin-left duration-200`}
          >
            Logout
          </span>
        </li>
      </div>
    </div>
  );
};

export default SideBar;
