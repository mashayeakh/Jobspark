import React, { useEffect, useState } from 'react'
import { useLocation, NavLink } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiChevronLeft,
    FiChevronRight,
    FiHome,
    FiUsers,
    FiBriefcase,
    FiUser,
    FiUserCheck,
    FiUserX,
    FiSearch,
    FiFileText,
    FiBarChart2,
    FiDownload,
    FiCheckCircle,
    FiXCircle,
    FiActivity,
    FiFilter
} from 'react-icons/fi'

const Admin_DashboardSidebar = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [jobSeekerOpen, setJobSeekerOpen] = useState(false)
    const [recruiterOpen, setRecruiterOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        // Set submenus open based on current path
        if (location.pathname.includes('/job-seeker')) {
            setJobSeekerOpen(true)
        }
        if (location.pathname.includes('/recruiter')) {
            setRecruiterOpen(true)
        }
    }, [location.pathname])

    const toggleSidebar = () => {
        setCollapsed(!collapsed)
    }

    // Animation variants
    const sidebarVariants = {
        open: { width: 280 },
        closed: { width: 80 }
    }

    const menuItemVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: -20 }
    }

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
    }

    const subMenuItemVariants = {
        open: { opacity: 1, y: 0 },
        closed: { opacity: 0, y: -10 }
    }

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "flex items-center p-2 text-primary bg-primary/10 rounded-lg font-medium"
            : "flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"

    return (
        <motion.aside
            initial={collapsed ? "closed" : "open"}
            animate={collapsed ? "closed" : "open"}
            variants={sidebarVariants}
            className="bg-white shadow-xl max-h-full overflow-y-auto overflow-x-hidden flex flex-col border-r border-gray-200 transition-all duration-300"
        >

            <div className="p-4 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-bold text-gray-800"
                            >
                                Admin Panel
                            </motion.h2>
                        )}
                    </AnimatePresence>
                    <motion.button
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        onClick={toggleSidebar}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <FiChevronRight className="text-xl" />
                        ) : (
                            <FiChevronLeft className="text-xl" />
                        )}
                    </motion.button>
                </div>

                <ul className="space-y-1">
                    {/* Dashboard Link */}
                    <motion.li layout>
                        <NavLink
                            to="/admin/dashboard"
                            className={navLinkClass}
                        >
                            <FiHome className="w-5 h-5 flex-shrink-0" />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        variants={menuItemVariants}
                                        className="ml-3"
                                    >
                                        Dashboard
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </NavLink>
                    </motion.li>

                    {/* Job Seeker Section */}
                    <motion.li layout className="mt-4">
                        <motion.button
                            onClick={() => setJobSeekerOpen(!jobSeekerOpen)}
                            className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                animate={{ rotate: jobSeekerOpen && !collapsed ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiUser className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                            </motion.div>
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.div
                                        className="flex items-center justify-between flex-1"
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        variants={menuItemVariants}
                                    >
                                        <span className="ml-3">Job Seeker</span>
                                        <motion.div
                                            animate={{ rotate: jobSeekerOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FiChevronRight className="text-gray-500" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <AnimatePresence>
                            {jobSeekerOpen && !collapsed && (
                                <motion.ul
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={subMenuVariants}
                                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                                >
                                    {/* Job Seeker Dashboard */}
                                    <motion.li variants={subMenuItemVariants}>
                                        <NavLink
                                            to="/admin/job-seeker/dashboard"
                                            className={({ isActive }) =>
                                                `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                            }
                                        >
                                            <FiBarChart2 className="w-4 h-4 mr-3" />
                                            <span>Dashboarddd</span>
                                        </NavLink>
                                    </motion.li>

                                    {/* All Job Seekers Section */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiUsers className="w-4 h-4 mr-3" />
                                            <span>All Job Seekers</span>
                                        </div>
                                        <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/all/active-profile"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiUserCheck className="w-4 h-4 mr-3" />
                                                    <span>Active Profiles</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/all/suspended-profile"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiUserX className="w-4 h-4 mr-3" />
                                                    <span>Suspended Profiles</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/all/verified-porfile"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiCheckCircle className="w-4 h-4 mr-3" />
                                                    <span>Verified Profiles</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/all/unverified-profile"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiXCircle className="w-4 h-4 mr-3" />
                                                    <span>Unverified Profiles</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul>
                                    </motion.li>

                                    {/* Search & Filters */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        {/* <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiSearch className="w-4 h-4 mr-3" />
                                            <span>Search & Filters</span>
                                        </div> */}

                                        <NavLink
                                            to="/admin/job-seeker/search"
                                            className={navLinkClass}
                                        >
                                            <FiSearch className="w-4 h-4 mr-2" />
                                            <AnimatePresence>
                                                {!collapsed && (
                                                    <motion.span
                                                        initial="closed"
                                                        animate="open"
                                                        exit="closed"
                                                        variants={menuItemVariants}
                                                        className="ml-3"
                                                    >
                                                        Search & Filters
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </NavLink>


                                        {/* <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/search"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiSearch className="w-4 h-4 mr-2" />
                                                    <span>Search & Filter</span>
                                                </NavLink>

                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/search/status"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Filter by Status</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/search/advanced"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiFilter className="w-4 h-4 mr-1" />
                                                    <span>Advanced Search</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul> */}
                                    </motion.li>

                                    {/* Analytics */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiBarChart2 className="w-4 h-4 mr-3" />
                                            <span>Analytics</span>
                                        </div>
                                        <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/analytics/activity-tracking"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiActivity className="w-4 h-4 mr-3" />
                                                    <span>Activity Tracking</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/skills-breakdown"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Skills Breakdown</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul>
                                    </motion.li>

                                    {/* Reports & Exports */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiDownload className="w-4 h-4 mr-3" />
                                            <span>Reports & Exports</span>
                                        </div>
                                        <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/export/active-profiles"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Export Active Profiles</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/export/application-reports"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Application Reports</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/job-seeker/export/downloaded-data"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiFileText className="w-4 h-4 mr-1" />
                                                    <span>Download Data</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul>
                                    </motion.li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.li>

                    {/* Recruiter Section */}
                    <motion.li layout className="mt-4">
                        <motion.button
                            onClick={() => setRecruiterOpen(!recruiterOpen)}
                            className="flex items-center w-full p-2 text-gray-700 hover:bg-gray-100 rounded-lg group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.div
                                animate={{ rotate: recruiterOpen && !collapsed ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FiBriefcase className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                            </motion.div>
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.div
                                        className="flex items-center justify-between flex-1"
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                        variants={menuItemVariants}
                                    >
                                        <span className="ml-3">Recruiter</span>
                                        <motion.div
                                            animate={{ rotate: recruiterOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FiChevronRight className="text-gray-500" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <AnimatePresence>
                            {recruiterOpen && !collapsed && (
                                <motion.ul
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                    variants={subMenuVariants}
                                    className="ml-8 mt-1 space-y-1 overflow-hidden"
                                >
                                    {/* Recruiter Dashboard */}
                                    <motion.li variants={subMenuItemVariants}>
                                        <NavLink
                                            to="/admin/recruiter/recruiter_dashboard"
                                            className={({ isActive }) =>
                                                `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                            }
                                        >
                                            <FiBarChart2 className="w-4 h-4 mr-3" />
                                            <span>Dashboardd</span>
                                        </NavLink>
                                    </motion.li>

                                    {/* Manage Recruiter Profiles */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiUsers className="w-4 h-4 mr-3" />
                                            <span>Manage Recruiters</span>
                                        </div>
                                        <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                {/* <NavLink
                                                    to="/admin/recruiter/all"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">All Recruiters</span>
                                                </NavLink> */}
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/all/active_recruiters"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiUserCheck className="w-4 h-4 mr-3" />
                                                    <span>Active Recruiters</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/all/inactive_recruiters"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiUserX className="w-4 h-4 mr-3" />
                                                    <span>Inactive Recruiters</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul>
                                    </motion.li>

                                    {/* Recruiter Actions */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiActivity className="w-4 h-4 mr-3" />
                                            <span>Recruiter Actions</span>
                                        </div>
                                        <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/action/approve_recruiter"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiCheckCircle className="w-4 h-4 mr-3" />
                                                    <span>Approve Recruiters</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/action/Suspended_Recruiter"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiUserX className="w-4 h-4 mr-3" />
                                                    <span>Suspend Recruiters</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/action/verify-documents"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiFileText className="w-4 h-4 mr-3" />
                                                    <span>Verify Documents</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul>
                                    </motion.li>

                                    {/* Recruiter Analytics */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiBarChart2 className="w-4 h-4 mr-3" />
                                            <span>Analytics</span>
                                        </div>
                                        <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/analytics/recruiter_job-postings"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Job Postings</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/analytics/application"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Job Seeker Applications</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/analytics/performance"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Recruiter Performance</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul>
                                    </motion.li>

                                    {/* Reports & Exports */}
                                    <motion.li variants={subMenuItemVariants} className="mt-2">
                                        <div className="flex items-center p-2 text-gray-600 font-medium">
                                            <FiDownload className="w-4 h-4 mr-3" />
                                            <span>Reports & Exports</span>
                                        </div>
                                        <motion.ul className="ml-6 mt-1 space-y-1">
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/export/recruiter-data"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Export Recruiter Data</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/export/application_data"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <span className="ml-1">Export Application Data</span>
                                                </NavLink>
                                            </motion.li>
                                            <motion.li variants={subMenuItemVariants}>
                                                <NavLink
                                                    to="/admin/recruiter/export/activity-reports"
                                                    className={({ isActive }) =>
                                                        `flex items-center p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"}`
                                                    }
                                                >
                                                    <FiFileText className="w-4 h-4 mr-1" />
                                                    <span>Activity Reports</span>
                                                </NavLink>
                                            </motion.li>
                                        </motion.ul>
                                    </motion.li>
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </motion.li>
                </ul>
            </div>

            {/* Sidebar footer */}
            <div className="p-4 border-t border-gray-200">
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-gray-500"
                        >
                            Admin Panel v1.0
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.aside>
    )
}

export default Admin_DashboardSidebar