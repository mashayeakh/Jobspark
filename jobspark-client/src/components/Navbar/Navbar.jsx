import React, { useContext, useState } from 'react'

// import logo from "../../assets/imgs/logo.png"
import j from "../../assets/imgs/j.jpg"
import logo2 from "../../assets/imgs/logo2.png"
import { Link, NavLink, useNavigate } from 'react-router'
import { ThemeContext } from '../Context/ThemeProvider'
import { Player } from '@lottiefiles/react-lottie-player';

import signupAnimation from "../../assets/imgs/animations/signup.json"
import { useStableMemo } from 'flowbite-react/helpers/resolve-theme'
import { AuthContext } from '../Context/AuthContextProvider'


const Navbar = () => {

    const { user } = useContext(AuthContext);

    console.log("User ", user);
    console.log("USER = ", user?.name);
    // console.log("ROLE = ", user?.role || "No Role");
    console.log("ROLE = ", user ? user.role : "No User");


    const links = (
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
            {
                // if(fsd){

                // }
                // user ? <button>
                //     logout
                // </button> : ""
                user && (user?.role === "job_seeker") ? <div>
                    {user?.name || "Job Seeker"}
                </div> :
                    (user?.role === "recruiter") ? <div>
                        {user?.name || "recruiter"}
                    </div> : ""
            }

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
    )

    const navigate = useNavigate();

    const handleJoinNow = () => {

    }

    const handleJobSeekingForm = () => {

        const modal = document.getElementById("my_modal_1");
        if (modal) {
            modal.close();
        }
        navigate("/job-seeking-form");
    }
    const handleFormRecruiter = () => {

        const modal = document.getElementById("my_modal_1");
        if (modal) {
            modal.close();
        }
        navigate("/recruiter-form?role=recruiter");
    }


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
                <div className="navbar-end">
                    <Link to="/signin">
                        <button onClick={handleJoinNow} className="btn btn-primary mr-2 px-6 py-2 lg:px-8 lg:py-3 md:px-6 md:py-2 sm:px-3 sm:py-1 text-sm lg:text-base">
                            Join Now
                        </button>
                    </Link>

                    {/* <button className="btn btn-warning px-6 py-2 lg:px-8 lg:py-3 md:px-6 md:py-2 sm:px-3 sm:py-1 text-sm lg:text-base">
                            Signup
                        </button> */}
                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    <button className="btn bg-warning" onClick={() => document.getElementById('my_modal_1').showModal()}>Signup</button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box flex flex-col items-center justify-center">

                            {/* Animation */}
                            <Player
                                autoplay
                                loop
                                src={signupAnimation}
                                style={{ height: '200px', width: '200px' }}
                            />

                            {/* Links */}
                            <div className="modal-action flex justify-around items-center w-full mt-4">
                                <button onClick={handleFormRecruiter} className="link link-primary">Sign up as a Recruiter</button>

                                <button onClick={handleJobSeekingForm} className="link link-primary">Sign up as a Job Seeker</button>

                            </div>
                        </div>
                    </dialog>


                </div>
                <ul className='menu menu-horizontal px-1'>

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