import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import { TotalApplicationContext } from '../../../../../Context/TotalApplicationProvider';
import { FaSearch, FaSort } from 'react-icons/fa';
import { MdCleaningServices, MdGridView } from "react-icons/md";
import { MdOutlineTableChart, MdOutlineEmail } from "react-icons/md";
import { BsBriefcase, BsCheckLg, BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const TotalApplicants = () => {
    // Original state and context hooks
    const { appliedInfo, allApplicantsInfo, newApplicantsToday, allApplicantsInfoTable, activity } = useContext(TotalApplicationContext);
    const { user } = useContext(AuthContext);
    const [showDataInfo, setShowDataInfo] = useState({});
    const [showAllApplicantsInfoInGridView, setShowAllApplicantsInfoInGridView] = useState({});
    const [view, setView] = useState(true);
    const [newAppli, setNewAppli] = useState(null);
    const [counts, setCounts] = useState({
        shortlistedCount: 0,
        rejectedCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Animation variants
    const controls = useAnimation();

    // Enhanced animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            transition: {
                y: { duration: 0.2, ease: "easeOut" },
                boxShadow: { duration: 0.3 }
            }
        },
        tap: { scale: 0.98 }
    };

    const statsVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 10
            }
        },
        hover: {
            scale: 1.03,
            transition: { duration: 0.2 }
        }
    };

    const tableRowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.4,
                ease: "backOut"
            }
        }),
        hover: {
            backgroundColor: "rgba(243, 244, 246, 1)",
            transition: { duration: 0.2 }
        }
    };

    const viewSwitchVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    // Original data fetching functions
    const showInfo = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applications`;
        try {
            const data = await appliedInfo(url);
            if (data.status === true) {
                setShowDataInfo(data);
            }
        } catch (err) {
            console.log("Error from total Application", err.message);
        }
    };

    const showAllInfoGrid = async () => {
        // const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applicants-info`;
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/applicants`
        // console.log("hit ", url);
        try {
            const data = await allApplicantsInfo(url);
            if (data.success === true) {
                setShowAllApplicantsInfoInGridView(data);
            }
        } catch (err) {
            console.log("Error from total Application", err.message);
        }
    };


    const [showAllApplicantsTableView, setShowAllApplicantsTableView] = useState({});

    const showAllInfoTable = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applicants-info`;
        // const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/applicants`
        try {
            const data = await allApplicantsInfoTable(url);
            if (data.success === true) {
                setShowAllApplicantsTableView(data);
            }
        } catch (err) {
            console.log("Error from total Application", err.message);
        }
    };


    const newApplication = async () => {
        try {
            const url = `http://localhost:5000/api/v1/today/recruiter/${user?._id}`;
            const hasNewApplicationSubmitted = await newApplicantsToday(url);
            if (hasNewApplicationSubmitted.status === true) {
                setNewAppli(hasNewApplicationSubmitted);
            }
        } catch (err) {
            console.error("Error fetching today's applications:", err.message);
        }
    };

    useEffect(() => {
        if (!user?._id) return;
        showInfo();
        showAllInfoGrid();
        newApplication();
        showAllInfoTable();
    }, [user?._id]);

    console.log("VV", showAllApplicantsInfoInGridView);
    console.log("tab", showAllApplicantsTableView);


    // const test = () => {
    //     activity?.shortlistedCount;
    // }

    console.log("ACTIVITY ", activity);


    // useEffect(() => {
    //     // const fetchCounts = async () => {
    //     //     try {
    //     //         setLoading(true);
    //     //         const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/numOfStatus`
    //     //         console.log("Calling from ", url);
    //     //         const response = await fetch(
    //     //             url
    //     //         );
    //     //         if (!response.ok) throw new Error("Network response was not ok");
    //     //         const data = await response.json();
    //     //         setCounts({
    //     //             shortlistedCount: data.shortlistedCount,
    //     //             rejectedCount: data.rejectedCount,
    //     //         });
    //     //         setLoading(false);
    //     //     } catch (err) {
    //     //         setError("Failed to fetch counts");
    //     //         setLoading(false);
    //     //     }
    //     // };

    //     if (user?._id)
    //         activity.shortlistedCount
    // }, [user?._id]);

    const totalApplicants = showDataInfo.data?.jobs.map(j => j?.applicantsCount || 0).reduce((acc, crrVal) => acc + crrVal, 0);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!user?._id) return;

        const fetchAllData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    showInfo(),
                    showAllInfoGrid(),
                    newApplication(),
                    showAllInfoTable()
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [user?._id]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header with enhanced animation */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                        y: { type: "spring", stiffness: 100 },
                        opacity: { duration: 0.6 }
                    }}
                    className="mb-8 text-center sm:text-left"
                >
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-gray-900 mb-2"
                    >
                        Applicant Dashboard
                    </motion.h1>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl font-semibold text-gray-700"
                        >
                            Total Applications: <span className="text-blue-600 font-bold">{totalApplicants || 0}</span>
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200"
                        >
                            <span className="text-sm text-gray-600">View:</span>
                            <button
                                onClick={() => setView(true)}
                                className={`p-2 rounded-md transition-colors ${view ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <MdGridView size={20} />
                            </button>
                            <button
                                onClick={() => setView(false)}
                                className={`p-2 rounded-md transition-colors ${!view ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <MdOutlineTableChart size={20} />
                            </button>
                            <button className='btn btn-primary'>
                                Downlaod application List
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats Cards with enhanced spring animations */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
                >
                    {[
                        {
                            title: "Total Applications",
                            value: totalApplicants || 0,
                            icon: <BsBriefcase className="text-blue-600 text-xl" />,
                            color: "blue",
                            delay: 0.1
                        },
                        {
                            title: "New Today",
                            value: newAppli?.count || 0,
                            icon: <BsCheckLg className="text-green-600 text-xl" />,
                            color: "green",
                            delay: 0.2
                        },
                        {
                            title: "Shortlisted",
                            value: activity?.shortlistedCount || 0,
                            icon: <MdOutlineEmail className="text-yellow-600 text-xl" />,
                            color: "yellow",
                            delay: 0.3
                        },
                        {
                            title: "Rejected",
                            value: activity?.rejectedCount || 0,
                            icon: <MdCleaningServices className="text-red-600 text-xl" />,
                            color: "red",
                            delay: 0.4
                        }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={statsVariants}
                            whileHover="hover"
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: stat.delay }}
                            className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-${stat.color}-500 relative`}
                        >
                            <motion.div
                                className={`absolute top-0 left-0 w-full h-1 bg-${stat.color}-500`}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: stat.delay + 0.1, duration: 0.6 }}
                            />
                            <div className="p-6 flex items-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: stat.delay, type: "spring", stiffness: 200 }}
                                    className={`bg-${stat.color}-100 p-3 rounded-full mr-4`}
                                >
                                    {stat.icon}
                                </motion.div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <motion.p
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: stat.delay + 0.2 }}
                                        className="text-2xl font-bold text-gray-800"
                                    >
                                        {stat.value}
                                    </motion.p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search and Filters with enhanced interactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <motion.div
                            className="flex-1"
                            whileHover={{ y: -2 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <motion.input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search applicants..."
                                    whileFocus={{
                                        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                                        transition: { duration: 0.2 }
                                    }}
                                />
                            </div>
                        </motion.div>
                        <div className="flex gap-4">
                            <motion.div
                                className="w-40"
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                    <option>Filter by</option>
                                    <option>All</option>
                                    <option>Recent</option>
                                    <option>Pending</option>
                                </select>
                            </motion.div>
                            <motion.div
                                className="w-40"
                                whileHover={{ y: -2 }}
                                transition={{ duration: 0.2 }}
                            >
                                <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                    <option>Status</option>
                                    <option>All</option>
                                    <option>Shortlisted</option>
                                    <option>Rejected</option>
                                </select>
                            </motion.div>
                            <motion.div
                                ref={dropdownRef}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm"
                                >
                                    <FaSort className="text-gray-500" />
                                    <span>Sort By</span>
                                </button>

                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                    >
                                        <div className="py-1">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Newest</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Oldest</a>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Applicants List with enhanced transitions */}
                <AnimatePresence mode="wait">
                    {view ? (
                        <motion.div
                            key="grid-view"
                            variants={viewSwitchVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
                        >
                            {showAllApplicantsInfoInGridView?.data?.map((applicant, idx) => (
                                <motion.div
                                    key={applicant.userId || idx}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    transition={{ delay: idx * 0.05 }}
                                    className="border border-gray-200 rounded-xl overflow-hidden bg-white relative"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-blue-500 opacity-0 hover:opacity-5 transition-opacity duration-300"
                                    />
                                    <div className="p-4 flex justify-end">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="dropdown dropdown-end"
                                        >
                                            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                                                <BsThreeDotsVertical className="text-gray-500" />
                                            </div>
                                            <motion.ul
                                                tabIndex={0}
                                                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-gray-200"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                <li><a>View Profile</a></li>
                                                <li><a>Shortlist</a></li>
                                                <li><a>Reject</a></li>
                                            </motion.ul>
                                        </motion.div>
                                    </div>
                                    <div className="px-6 pb-6 flex flex-col items-center">
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring" }}
                                            whileHover={{ scale: 1.05 }}
                                            className="avatar mb-4"
                                        >
                                            <div className="w-24 rounded-full ring ring-blue-500 ring-offset-2">
                                                <img src="https://randomuser.me/api/portraits/women/79.jpg" alt={applicant.userName} />
                                            </div>
                                        </motion.div>
                                        <motion.h3
                                            className="text-lg font-bold text-gray-900 mb-1"
                                            whileHover={{ color: "#2563eb" }}
                                        >
                                            {applicant?.name.toUpperCase()}
                                        </motion.h3>
                                        <p className="text-sm text-gray-500 mb-3">Applied Jobs: {applicant.appliedJobIds?.length || 0}</p>
                                        <div className="text-center text-sm text-gray-700 mb-4">
                                            {applicant.jobTitles?.join(", ")}
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link
                                                to={`/recruiter/dashboard/summary-cards/applicant-details/recruiter/${user?._id}/applicant/${applicant.userId}/job/${applicant.jobId}`}
                                                className="btn btn-sm btn-primary w-full"
                                            >
                                                View Detailsaaa
                                            </Link>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="table-view"
                            variants={viewSwitchVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative overflow-x-auto bg-white rounded-xl shadow-sm p-4 border border-gray-200"
                        >
                            {/* Download Button - positioned top-right */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-4 right-4 z-10"
                            >
                                <button>
                                    Downlaod
                                </button>
                                {/* <button
                                    onClick={handleDownloadCSV}
                                    disabled={isDownloading}
                                    className={`
                flex items-center gap-2 px-4 py-2 rounded-md
                bg-blue-600 text-white text-sm font-medium
                hover:bg-blue-700 transition-all duration-200
                shadow-md hover:shadow-lg
                ${isDownloading ? 'opacity-80 cursor-wait' : ''}
            `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isDownloading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                            </svg>
                                            Download CSV
                                        </>
                                    )}
                                </button> */}
                            </motion.div>

                            {/* Your existing table - completely unchanged */}
                            <table className="table w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {showAllApplicantsTableView?.data?.map((applicant, idx) => (
                                        <motion.tr
                                            key={applicant.userId}
                                            custom={idx}
                                            variants={tableRowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            whileHover="hover"
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idx + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.userName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{applicant.jobTitle}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <motion.span
                                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {applicant?.jobType}
                                                </motion.span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <motion.span
                                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {applicant?.status}
                                                </motion.span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <motion.span
                                                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-sky-200 text-green-800"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {applicant?.appliedAt}
                                                </motion.span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <motion.div whileHover={{ scale: 1.05 }}>
                                                    <Link
                                                        to={`/recruiter/dashboard/summary-cards/applicant-details/recruiter/${user?._id}/applicant/${applicant?.userId}/job/${applicant?.jobId}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        View Details
                                                    </Link>
                                                </motion.div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Enhanced Loading State */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center items-center py-12"
                    >
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.1, 1],
                                opacity: [0.6, 1, 0.6]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.2,
                                ease: "linear"
                            }}
                            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                        />
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && showAllApplicantsInfoInGridView?.data?.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                    >
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                transition: { repeat: Infinity, duration: 2 }
                            }}
                            className="inline-block mb-4"
                        >
                            <BsBriefcase className="text-gray-400 text-5xl" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-gray-900">No applicants found</h3>
                        <p className="mt-1 text-gray-500">There are currently no applicants matching your criteria.</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default TotalApplicants;