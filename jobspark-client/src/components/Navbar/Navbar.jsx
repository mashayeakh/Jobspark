import React from 'react'

// import logo from "../../assets/imgs/logo.png"
import j from "../../assets/imgs/j.jpg"
import logo2 from "../../assets/imgs/logo2.png"
import { Link, NavLink } from 'react-router'
const Navbar = () => {


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
                        {/* <li className="relative">
                            <details className="dropdown">
                                <summary className="btn btn-ghost">{"language"}</summary>
                                <ul className="p-2  menu dropdown-content bg-base-100 rounded-box w-32">
                                    <li><a>EN</a></li>
                                    <li><a onClick={() => handleChange('বাংলা')}>BN</a></li>
                                    <li><a onClick={() => handleChange('हिन्दी')}>HI</a></li>
                                </ul>
                            </details>
                        </li> */}
                    </ul>
                </div>
                <div className="navbar-end">
                    <button className="btn btn-primary mr-2 px-6 py-2 lg:px-8 lg:py-3 md:px-6 md:py-2 sm:px-3 sm:py-1 text-sm lg:text-base">
                        Join Now
                    </button>
                    <button className="btn btn-warning px-6 py-2 lg:px-8 lg:py-3 md:px-6 md:py-2 sm:px-3 sm:py-1 text-sm lg:text-base">
                        Signup
                    </button>
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
            </div >
        </>

    )
}

export default Navbar