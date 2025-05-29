import React, { useContext, useState } from 'react'

// import logo from "../../assets/imgs/logo.png"
import j from "../../assets/imgs/j.jpg"
import logo2 from "../../assets/imgs/logo2.png"
import profile from "../../assets/imgs/icons/user.png"
import { Link, NavLink, useNavigate } from 'react-router'
import { ThemeContext } from '../Context/ThemeProvider'
import { Player } from '@lottiefiles/react-lottie-player';

import signupAnimation from "../../assets/imgs/animations/signup.json"
import { useStableMemo } from 'flowbite-react/helpers/resolve-theme'
import { AuthContext } from '../Context/AuthContextProvider'
import { SlSettings } from "react-icons/sl";
import { IoLogOutOutline } from "react-icons/io5";


const Navbar = () => {

    const { user, signingOut } = useContext(AuthContext);

    console.log("User ", user);
    console.log("USER = ", user?.name);
    // console.log("ROLE = ", user?.role || "No Role");
    console.log("ROLE = ", user ? user.role : "No User");

    const handleSignout = async (e) => {
        e.preventDefault();

        // Call the signingOut function and wait for it to complete
        const success = await signingOut();

        // If signing out is successful, navigate to the signin page
        if (success) {
            navigate("/signin");
        }
    };

    const links = (
        <>


            {user?.role === "recruiter" ? (
                <>
                    <li>
                        <NavLink
                            to="/recruiter/dashboard/summary-cards"
                            className={({ isActive }) =>
                                isActive
                                    ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                    : ""
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/applications"
                            className={({ isActive }) =>
                                isActive
                                    ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                    : ""
                            }
                        >
                            Applications
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/company-profile"
                            className={({ isActive }) =>
                                isActive
                                    ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                    : ""
                            }
                        >
                            Company Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/notification"
                            className={({ isActive }) =>
                                isActive
                                    ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                    : ""
                            }
                        >
                            Notification
                        </NavLink>
                    </li>
                </>
            ) :
                (
                    <>
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive
                                        ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                        : ""
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/jobs"
                                className={({ isActive }) =>
                                    isActive
                                        ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                        : ""
                                }
                            >
                                Jobs
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/companies"
                                className={({ isActive }) =>
                                    isActive
                                        ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                        : ""
                                }
                            >
                                Companies
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/network"
                                className={({ isActive }) =>
                                    isActive
                                        ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                        : ""
                                }
                            >
                                Network
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/notification"
                                className={({ isActive }) =>
                                    isActive
                                        ? "underline decoration-2 decoration-primary text-primary font-semibold"
                                        : ""
                                }
                            >
                                Notification
                            </NavLink>
                        </li>
                    </>
                )}
            {/* Fallback or logged out user (optional) */}
            {/*  */}
        </>
    );


    const navigate = useNavigate();

    // const handleJoinNow = () => {

    // }

    // const handleJobSeekingForm = () => {

    //     const modal = document.getElementById("my_modal_1");
    //     if (modal) {
    //         modal.close();
    //     }
    //     navigate("/job-seeking-form");
    // }
    // const handleFormRecruiter = () => {

    //     const modal = document.getElementById("my_modal_1");
    //     if (modal) {
    //         modal.close();
    //     }
    //     navigate("/recruiter-form?role=recruiter");
    // }


    return (
        <>
            <div className="navbar bg-white/20 bg-opacity-50 md:px-5 lg:px-10 border-b border-gray-300 shadow-md ">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {links}
                        </ul>
                    </div>
                    <Link to="/" className="text-xl">
                        JOBSPARK
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 text-lg">
                        {links}
                    </ul>
                </div>
                <div className="navbar-end mr-4">
                    {user ? (
                        <div className="dropdown dropdown-bottom">
                            <div tabIndex={0} role="button">
                                <div className="avatar cursor-pointer">
                                    <div className="ring-primary ring-offset-base-100 rounded-full ring-2 ring-offset-2 w-10 h-10 overflow-hidden">
                                        <img
                                            src={user.photoURL || "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"}
                                            className="w-full h-full object-cover"
                                            alt="User Avatar"
                                        />
                                    </div>
                                </div>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-36 p-2 shadow-sm">
                                <li>
                                    <Link to="/profile">
                                        <div className="flex gap-2 items-center">
                                            <img src={profile} alt="" className="w-4" />
                                            Profile
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings">
                                        <div className="flex gap-2 items-center">
                                            <SlSettings size={20} />
                                            Settings
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleSignout} className="flex gap-2 items-center w-full text-left">
                                        <IoLogOutOutline size={20} />
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link to="/signin">
                                <button className="btn btn-primary mr-2 px-6 py-2">Join Now</button>
                            </Link>
                        </>
                    )}
                </div>

                <ul className='menu menu-horizontal px-1 mr-4'>

                    <li className="relative">
                        <details className="dropdown">
                            <summary className="text-sm">{"ENG"}</summary>
                            <ul className="p-2  menu dropdown-content  rounded-box w-20">
                                <li><a>EN</a></li>
                                {/* <li><a onClick={() => handleChange('বাংলা')}>BN</a></li>
                                    <li><a onClick={() => handleChange('हिन्दी')}>HI</a></li> */}
                            </ul>
                        </details>
                    </li>
                </ul>
                <label className="swap swap-rotate flex items-center border justify-center cursor-pointer">
                    {/* <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"} readOnly /> */}


                    {/* sun icon */}
                    <svg
                        className="swap-on h-8 w-8 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>

                    {/* moon icon */}
                    <svg
                        className="swap-off h-8 w-8 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24">
                        <path
                            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>
            </div >
        </>

    )
}

export default Navbar