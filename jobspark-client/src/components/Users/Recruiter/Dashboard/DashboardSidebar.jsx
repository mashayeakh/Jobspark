import React, { useEffect, useState } from 'react';
import {
    FcBookmark, FcBusiness, FcCheckmark, FcHome, FcPortraitMode
} from 'react-icons/fc';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router';

import activeJobs from "../../../../assets/imgs/icons/activeJobs.png";
import totalAppli from "../../../../assets/imgs/icons/totalApplicants.png";
import shortListed from "../../../../assets/imgs/icons/shortlisted.png";
import interviewSch from "../../../../assets/imgs/icons/scheduling.png";

const DashboardSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('/recruiter/dashboard/summary-cards')) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [location.pathname]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <aside className={`bg-white shadow-xl min-h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    {!collapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
                    <button className="btn p-2 btn-ghost ml-auto" onClick={toggleSidebar}>
                        {collapsed ? <FiChevronRight className='text-xl' /> : <FiChevronLeft className='text-xl' />}
                    </button>
                </div>
                <ul className="space-y-2 font-medium">
                    {/* Summary Cards Dropdown */}
                    <li>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                        >
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                            </svg>
                            {!collapsed && <span className="ms-3 flex-1 text-left">Summary Cards</span>}
                            {!collapsed && (
                                <svg
                                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>

                        {open && !collapsed && (
                            <ul className="ml-6 mt-2 space-y-1">
                                <li>
                                    <NavLink
                                        to="/recruiter/dashboard/summary-cards/active-Jobs"
                                        className={({ isActive }) =>
                                            `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <img src={activeJobs} alt="" className="w-6" />
                                            <p>Active Jobs</p>
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/recruiter/dashboard/summary-cards/total-applications"
                                        className={({ isActive }) =>
                                            `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <img src={totalAppli} alt="" className="w-5" />
                                            <p>Total Applications</p>
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/recruiter/dashboard/summary-cards/shortlisted"
                                        className={({ isActive }) =>
                                            `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <img src={shortListed} alt="" className="w-5" />
                                            <p>Shortlisted</p>
                                        </div>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/recruiter/dashboard/summary-cards/interviews-scheduled"
                                        className={({ isActive }) =>
                                            `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <img src={interviewSch} alt="" className="w-5" />
                                            <p>Interviews Scheduled</p>
                                        </div>
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Application Graph */}
                    <li>
                        <NavLink
                            to="/recruiter/dashboard/application-graph"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-200 font-semibold text-gray-900" : "text-gray-900 hover:bg-gray-100"}`
                            }
                        >
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                            </svg>
                            {!collapsed && <span className="flex-1 ms-3">Application Graph</span>}
                        </NavLink>
                    </li>

                    {/* Inbox */}
                    <li>
                        <NavLink
                            to="/recruiter/dashboard/inbox"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-200 font-semibold text-gray-900" : "text-gray-900 hover:bg-gray-100"}`
                            }
                        >
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                            </svg>
                            {!collapsed && <span className="flex-1 ms-3">Inbox</span>}
                            {!collapsed && (
                                <span className="w-5 h-5 ms-3 text-xs font-medium text-blue-800 bg-blue-100 rounded-full flex items-center justify-center">
                                    3
                                </span>
                            )}
                        </NavLink>
                    </li>

                    {/* Latest Applicants */}
                    <li>
                        <NavLink
                            to="/recruiter/dashboard/latest-applicants"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-200 font-semibold text-gray-900" : "text-gray-900 hover:bg-gray-100"}`
                            }
                        >
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                            </svg>
                            {!collapsed && <span className="flex-1 ms-3"> Latest Applicants</span>}
                        </NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
