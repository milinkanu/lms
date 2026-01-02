import React, { useContext } from "react";
import { assets, dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Logger from "./Logger"; // Imported Logger
import { AppContext } from "../../context/AppContext";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();
  const { isEducator } = useContext(AppContext)
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 dark:border-gray-500/50">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-28 lg:w-32" style={{ filter: theme === 'dark' ? 'invert(1)' : 'invert(0)' }} />
      </Link>

      <div className="flex items-center gap-5 text-gray-500 relative dark:text-gray-100">
        <div className="flex items-center gap-5">
          <button onClick={toggleTheme} className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors'>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="hidden md:block">
          <Logger />
        </div>
        <p>Hi! {user ? user.fullName : "Developers"} </p>
        {user ? (
          <UserButton />
        ) : (
          <img className="max-w-8" src={assets.profile_img} alt="profile_img" />
        )}
      </div>
    </div>
  );
};

export default Navbar;