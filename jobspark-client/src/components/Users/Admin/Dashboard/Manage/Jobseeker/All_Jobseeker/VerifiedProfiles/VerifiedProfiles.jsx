import React, { useState, useEffect, useContext } from "react";
import { BadgeCheck, AlertCircle, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { JobSeekerVerifiedContext } from "../../../../../../../Context/AdminContext/JobSeekerVerifiedContextProvider";

// Mock data - in a real app this would come from an API
const generateMockData = () => {
    return Array.from({ length: 299 }, (_, i) => ({
        id: i + 1,
        name: i < 200 ? `Verified User ${i + 1}` : `Unverified User ${i + 1}`,
        email: i < 200 ? `verified${i + 1}@example.com` : `unverified${i + 1}@example.com`,
        location: ["Lahore", "Karachi", "Islamabad", "Peshawar", "Quetta"][i % 5],
        experienceLevel: ["Entry Level", "Junior", "Mid Level", "Senior", "Executive"][i % 5],
        isVerified: i < 200,
        verifiedDetails: i < 200 ? {
            email: true,
            phone: Math.random() > 0.2,
            identity: Math.random() > 0.3,
            educationDocs: Math.random() > 0.4,
            lastVerified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        } : null
    }));
};

const VerifiedProfiles = () => {
    const [search, setSearch] = useState("");
    const [activeTab, setActiveTab] = useState("verified");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        location: "",
        experience: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [jobSeekersData, setJobSeekersData] = useState([]);


    // const 


    // Initialize with mock data
    useEffect(() => {
        setJobSeekersData(generateMockData());
    }, []);


    const { verified } = useContext(JobSeekerVerifiedContext);

    console.log("Verified -", verified);
    const totalJobSeeker = verified?.data?.jobSeeker;
    const verifiedJobSeeker = verified?.data?.verified;
    const unVerifiedJobSeeker = verified?.data?.unverified;

    console.log("verified?.data?.verifiedUsers =>", verified?.data?.verifiedUsers);


    // Filter logic
    const filteredProfiles = verified?.data?.totalUsers?.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesTab = activeTab === "all" ||
            (activeTab === "verified" && user.status === "Verified") ||
            (activeTab === "unverified" && !user.isVerified);
        const matchesLocation = !filters.location || user.location === filters.location;
        const matchesExperience = !filters.experience || user.experienceLevel === filters.experience;

        return matchesSearch && matchesTab && matchesLocation && matchesExperience;
    });

    console.log("Filt", filteredProfiles);


    // Pagination logic
    const totalItems = filteredProfiles?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProfiles?.slice(indexOfFirstItem, indexOfLastItem);

    const verifiedCount = jobSeekersData.filter(u => u.isVerified)?.length;
    const unverifiedCount = jobSeekersData.filter(u => !u.isVerified)?.length;

    // Get unique filter options
    const locations = [...new Set(jobSeekersData.map(u => u.location))];
    const experienceLevels = [...new Set(jobSeekersData.map(u => u.experienceLevel))];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const clearFilters = () => {
        setFilters({
            location: "",
            experience: ""
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const half = Math.floor(maxVisiblePages / 2);
            let start = currentPage - half;
            let end = currentPage + half;

            if (start < 1) {
                start = 1;
                end = maxVisiblePages;
            }

            if (end > totalPages) {
                end = totalPages;
                start = totalPages - maxVisiblePages + 1;
            }

            if (start > 1) {
                pages.push(1);
                if (start > 2) {
                    pages.push('...');
                }
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };



    // const { verified } = useContext(JobSeekerVerifiedContext);

    // console.log("Verified -", verified);
    // const totalJobSeeker = verified?.data?.jobSeeker;
    // const verifiedJobSeeker = verified?.data?.verified;
    // const unVerifiedJobSeeker = verified?.data?.unverified;


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6 max-w-6xl mx-auto"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <motion.h1
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-2xl md:text-3xl font-bold text-gray-800"
                >
                    Candidate Verification Dashboard
                </motion.h1>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative w-full md:w-64"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="input input-bordered w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // Reset to first page when searching
                            }}
                        />
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={toggleFilters}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <Filter size={16} />
                        Filters
                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </motion.button>
                </div>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-4 rounded-lg shadow-md mb-6 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filters.location}
                                    onChange={(e) => {
                                        setFilters({ ...filters, location: e.target.value });
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Locations</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                <select
                                    className="select select-bordered w-full"
                                    value={filters.experience}
                                    onChange={(e) => {
                                        setFilters({ ...filters, experience: e.target.value });
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="">All Levels</option>
                                    {experienceLevels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={clearFilters}
                                className="btn btn-ghost btn-sm text-gray-600"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                        setActiveTab("all");
                        setCurrentPage(1);
                    }}
                    className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === "all" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-600 hover:bg-gray-100"}`}
                >
                    All Candidates
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {totalJobSeeker}
                    </span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                        setActiveTab("verified");
                        setCurrentPage(1);
                    }}
                    className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === "verified" ? "text-green-600 border-b-2 border-green-500" : "text-gray-600 hover:bg-gray-100"}`}
                >
                    <BadgeCheck size={18} />
                    Verified
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {verifiedJobSeeker}
                    </span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                        setActiveTab("unverified");
                        setCurrentPage(1);
                    }}
                    className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === "unverified" ? "text-yellow-600 border-b-2 border-yellow-500" : "text-gray-600 hover:bg-gray-100"}`}
                >
                    <AlertCircle size={18} />
                    Unverified
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {unVerifiedJobSeeker}
                    </span>
                </motion.button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500"
                >
                    <div className="text-sm text-gray-500">Total Candidates</div>
                    <div className="text-2xl font-bold">{totalJobSeeker}</div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500"
                >
                    <div className="text-sm text-gray-500">Verified</div>
                    <div className="text-2xl font-bold text-green-600">{verifiedJobSeeker}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {Math.round((verifiedJobSeeker / totalJobSeeker) * 100)}% of total
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500"
                >
                    <div className="text-sm text-gray-500">Unverified</div>
                    <div className="text-2xl font-bold text-yellow-600">{unVerifiedJobSeeker}</div>
                    <div className="text-xs text-gray-500 mt-1">
                        {Math.round((unVerifiedJobSeeker / totalJobSeeker) * 100)}% of total
                    </div>
                </motion.div>
            </div>

            {/* Items per page selector */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <select
                        className="select select-bordered select-sm"
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

            {/* Profile Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <AnimatePresence>
                                {currentItems?.length > 0 ? (
                                    currentItems.map((user) => (
                                        <motion.tr
                                            key={user.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {user.experience}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {user?.status === "Verified" ? (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                                    >
                                                        <BadgeCheck className="mr-1" size={12} />
                                                        Verified
                                                    </motion.span>
                                                ) : user?.status === "Not Verified" ? (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                                                    >
                                                        <AlertCircle className="mr-1" size={12} />
                                                        Unverified
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                                                    >
                                                        <AlertCircle className="mr-1" size={12} />
                                                        Not Specified
                                                    </motion.span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {user.isVerified ? (
                                                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className="text-yellow-600 hover:text-yellow-900 font-medium"
                                                    >
                                                        Verify Now
                                                    </motion.button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center justify-center py-8">
                                                <Search className="text-gray-400 mb-2" size={32} />
                                                <p className="text-gray-500">No candidates match your filters</p>
                                                <button
                                                    onClick={() => {
                                                        setSearch("");
                                                        setFilters({
                                                            location: "",
                                                            experience: ""
                                                        });
                                                        setCurrentPage(1);
                                                    }}
                                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Clear all filters
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
                </div>

                <div className="flex gap-1">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        First
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <ChevronLeft size={16} />
                    </motion.button>

                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-1">...</span>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    {page}
                                </motion.button>
                            )}
                        </React.Fragment>
                    ))}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <ChevronRight size={16} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        Last
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default VerifiedProfiles;