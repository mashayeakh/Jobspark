import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Animation variants
    const sidebarVariants = {
        open: { width: 256 },
        closed: { width: 80 }
    };

    const menuItemVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: -20 }
    };

    const subMenuVariants = {
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        },
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const subMenuItemVariants = {
        open: { opacity: 1, y: 0 },
        closed: { opacity: 0, y: -10 }
    };

    return (
        <motion.aside
            initial={collapsed ? "closed" : "open"}
            animate={collapsed ? "closed" : "open"}
            variants={sidebarVariants}
            className="bg-white shadow-xl min-h-full overflow-y-auto overflow-x-hidden"
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold"
                            >
                                Dashboard
                            </motion.h2>
                        )}
                    </AnimatePresence>
                    <motion.button
                        className="btn p-2 btn-ghost ml-auto"
                        onClick={toggleSidebar}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {collapsed ? (
                            <FiChevronRight className='text-xl' />
                        ) : (
                            <FiChevronLeft className='text-xl' />
                        )}
                    </motion.button>
                </div>
                <ul className="space-y-2 font-medium">
                    {/* Summary Cards Dropdown */}
                    <motion.li layout>
                        <motion.button
                            onClick={() => setOpen(!open)}
                            className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                animate={{ rotate: open && !collapsed ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                            </motion.div>
                            <AnimatePresence>
                                {!collapsed && (
                                    <>
                                        <motion.span
                                            initial="open"
                                            animate="open"
                                            exit="closed"
                                            variants={menuItemVariants}
                                            className="ms-3 flex-1 text-left"
                                        >
                                            Summary Cards
                                        </motion.span>
                                        <motion.svg
                                            className="w-4 h-4 ml-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            animate={{ rotate: open ? 90 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </motion.svg>
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <AnimatePresence>
                            {open && !collapsed && (
                                <motion.ul
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={subMenuVariants}
                                    className="ml-6 mt-2 space-y-1 overflow-hidden"
                                >
                                    <motion.li variants={subMenuItemVariants}>
                                        <NavLink
                                            to="/recruiter/dashboard/summary-cards/active-Jobs"
                                            className={({ isActive }) =>
                                                `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                            }
                                        >
                                            <motion.div
                                                className="flex items-center gap-2"
                                                whileHover={{ x: 5 }}
                                            >
                                                <motion.img
                                                    src={activeJobs}
                                                    alt=""
                                                    className="w-6"
                                                    whileHover={{ scale: 1.1 }}
                                                />
                                                <p>Active Jobs</p>
                                            </motion.div>
                                        </NavLink>
                                    </motion.li>
                                    <motion.li variants={subMenuItemVariants}>
                                        <NavLink
                                            to="/recruiter/dashboard/summary-cards/total-applications"
                                            className={({ isActive }) =>
                                                `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                            }
                                        >
                                            <motion.div
                                                className="flex items-center gap-2"
                                                whileHover={{ x: 5 }}
                                            >
                                                <motion.img
                                                    src={totalAppli}
                                                    alt=""
                                                    className="w-5"
                                                    whileHover={{ scale: 1.1 }}
                                                />
                                                <p>Total Applications</p>
                                            </motion.div>
                                        </NavLink>
                                    </motion.li>
                                    <motion.li variants={subMenuItemVariants}>
                                        <NavLink
                                            to="/recruiter/dashboard/summary-cards/shortlisted"
                                            className={({ isActive }) =>
                                                `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                            }
                                        >
                                            <motion.div
                                                className="flex items-center gap-2"
                                                whileHover={{ x: 5 }}
                                            >
                                                <motion.img
                                                    src={shortListed}
                                                    alt=""
                                                    className="w-5"
                                                    whileHover={{ scale: 1.1 }}
                                                />
                                                <p>Shortlisted</p>
                                            </motion.div>
                                        </NavLink>
                                    </motion.li>
                                    <motion.li variants={subMenuItemVariants}>
                                        <NavLink
                                            to="/recruiter/dashboard/summary-cards/interviews-scheduled"
                                            className={({ isActive }) =>
                                                `block px-2 py-1 rounded ${isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`
                                            }
                                        >
                                            <motion.div
                                                className="flex items-center gap-2"
                                                whileHover={{ x: 5 }}
                                            >
                                                <motion.img
                                                    src={interviewSch}
                                                    alt=""
                                                    className="w-5"
                                                    whileHover={{ scale: 1.1 }}
                                                />
                                                <p>Interviews Scheduled</p>
                                            </motion.div>
                                        </NavLink>
                                    </motion.li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.li>

                    {/* Application Graph */}
                    <motion.li layout>
                        <NavLink
                            to="/recruiter/dashboard/application-graph"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-200 font-semibold text-gray-900" : "text-gray-900 hover:bg-gray-100"}`
                            }
                        >
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                            </motion.div>
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial="open"
                                        animate="open"
                                        exit="closed"
                                        variants={menuItemVariants}
                                        className="flex-1 ms-3"
                                    >
                                        Application Graph
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    </motion.li>

                    {/* Inbox */}
                    <motion.li layout>
                        <NavLink
                            to="/recruiter/dashboard/inbox"
                            className={({ isActive }) =>
                                `flex items-center p-2 rounded-lg ${isActive ? "bg-gray-200 font-semibold text-gray-900" : "text-gray-900 hover:bg-gray-100"}`
                            }
                        >
                            <motion.div whileHover={{ scale: 1.1 }}>
                                <svg className="w-5 h-5 text-gray-500 group-hover:text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>
                            </motion.div>
                            <AnimatePresence>
                                {!collapsed && (
                                    <>
                                        <motion.span
                                            initial="open"
                                            animate="open"
                                            exit="closed"
                                            variants={menuItemVariants}
                                            className="flex-1 ms-3"
                                        >
                                            Inbox
                                        </motion.span>
                                        <motion.span
                                            className="w-5 h-5 ms-3 text-xs font-medium text-blue-800 bg-blue-100 rounded-full flex items-center justify-center"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 500 }}
                                        >
                                            3
                                        </motion.span>
                                    </>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    </motion.li>
                </ul>
            </div>
        </motion.aside>
    );
};

export default DashboardSidebar;