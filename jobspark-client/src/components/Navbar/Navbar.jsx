import React, { useContext, useState } from 'react'
import j from "../../assets/imgs/j.jpg"
import logo2 from "../../assets/imgs/logo2.png"
import profile from "../../assets/imgs/icons/user.png"
import { Link, NavLink, useNavigate } from 'react-router'
import { ThemeContext } from '../Context/ThemeProvider'
import { Player } from '@lottiefiles/react-lottie-player';
import { FaRegBell } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import signupAnimation from "../../assets/imgs/animations/signup.json"
import { AuthContext } from '../Context/AuthContextProvider'
import { SlSettings } from "react-icons/sl";
import { IoLogOutOutline } from "react-icons/io5";
import { NotificationContext } from '../Context/NotificationContextProvider'
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, signingOut } = useContext(AuthContext);
    const { notification, markNotificationsRead } = useContext(NotificationContext);
    const unreadCount = notification?.filter(n => !n.isRead)?.length || 0;
    // const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();


    console.log("admin user ", user);


    const [searchQuery, setSearchQuery] = useState('');

    const handleSignout = async (e) => {
        e.preventDefault();
        const success = await signingOut();
        if (success) {
            navigate("/signin");
        }
    };

    const handleNotificationClick = () => {
        markNotificationsRead();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-primary font-bold border-b-2 border-primary transition-all duration-200"
            : "text-gray-700 hover:text-primary hover:font-semibold transition-all duration-200";

    const links = (
        <>
            {user?.role === "recruiter" ? (
                <>
                    <li>
                        <NavLink
                            to="/recruiter/dashboard/summary-cards/active-Jobs"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2zm4 8h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V7h-2v2z"></path></svg>
                                Dashboard
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/company-profile"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21v-7a2 2 0 012-2h14a2 2 0 012 2v7"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                                Company Profile
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/notification" className={navLinkClass} onClick={handleNotificationClick}>
                            <span className="flex items-center gap-2 relative">
                                <FaRegBell size={20} className="text-primary" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                                Notification
                            </span>
                        </NavLink>
                    </li>
                </>
            ) : (
                <>
                    <li>
                        <NavLink
                            to="/"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"></path></svg>
                                Home
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/jobs"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"></path></svg>
                                Jobs
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/companies"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21v-7a2 2 0 012-2h14a2 2 0 012 2v7"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                                Companies
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/dashboard"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21v-7a2 2 0 012-2h14a2 2 0 012 2v7"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
                                Admin
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/network"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-3-3.87"></path><path d="M9 20H4v-2a4 4 0 013-3.87"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Network
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/notification"
                            className={navLinkClass}
                        >
                            <span className="flex items-center gap-2 relative">
                                <span className="relative">
                                    <FaRegBell size={20} className="text-primary" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </span>
                                Notification
                            </span>
                        </NavLink>
                    </li>
                </>
            )}
        </>
    );

    return (
        <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="navbar bg-white/95 backdrop-blur-sm bg-opacity-50 md:px-5 lg:px-10 border-b border-gray-200 shadow-sm sticky top-0 z-50"
        >
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg">
                        {links}
                    </ul>
                </div>
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    JOBSPARK
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-lg gap-1">
                    {links}
                </ul>
            </div>

            <div className="navbar-end gap-2">
                {user && (
                    <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="input input-bordered input-sm w-40 md:w-48 lg:w-64 pl-8 pr-4 rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FiSearch className="absolute left-3 text-gray-400" />
                    </form>
                )}

                <div className="flex items-center gap-2">
                    <div className="dropdown dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm rounded-full">
                            <span className="text-sm">{"ENG"}</span>
                        </div>
                        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-20 z-50">
                            <li><button className="active:bg-gray-100">EN</button></li>
                        </ul>
                    </div>

                    <label className="swap swap-rotate btn btn-ghost btn-sm rounded-full">
                        <input
                            type="checkbox"
                        // onChange={toggleTheme}
                        // checked={theme === "dark"}
                        />
                        <svg
                            className="swap-on w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                        </svg>
                        <svg
                            className="swap-off w-5 h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    </label>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2">
                                    <img
                                        src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}
                                        alt="User Avatar"
                                    />
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                <li>
                                    <Link to="/profile" className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings">
                                        <SlSettings size={16} />
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleSignout}>
                                        <IoLogOutOutline size={16} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <Link to="/signin">
                            <button className="btn btn-primary btn-sm md:btn-md px-4 md:px-6">
                                Join Now
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default Navbar