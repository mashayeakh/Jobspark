import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useJobSeekerProfiles from "../../../../../../Hooks/userJobSeekerProfile";
import { FiClock, FiMail, FiUser } from "react-icons/fi";
import { JobSeekerExportDataContext } from "../../../../../../Context/AdminContext/JobSeekerExportDataContextProvider";
import { getMethod } from "../../../../../../Utils/Api";

const ExportData = () => {
    const [activeTab, setActiveTab] = useState("profiles");
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("All Locations");
    const [exporting, setExporting] = useState(false);
    const [downloading, setDownloading] = useState(null);

    // Dummy Active Profiles
    // const profiles = [
    //     { id: 1, name: "John Doe", role: "Frontend Dev", email: "john@example.com", location: "Dhaka", status: "Active", lastActive: "2025-08-18" },
    //     { id: 2, name: "Sarah Khan", role: "Backend Dev", email: "sarah@example.com", location: "Chattogram", status: "Active", lastActive: "2025-08-12" },
    //     { id: 3, name: "Ayesha Ali", role: "UI/UX Designer", email: "ayesha@example.com", location: "Sylhet", status: "Inactive", lastActive: "2025-07-10" },
    //     { id: 4, name: "Michael Smith", role: "Fullstack Dev", email: "michael@example.com", location: "Rajshahi", status: "Active", lastActive: "2025-08-15" },
    // ];


    // const { profiles } = useJobSeekerProfiles();

    const { activeProfile, allLoc } = useContext(JobSeekerExportDataContext);

    console.log("AAAAAAA ", allLoc)
    const profiles = activeProfile?.data || [];

    // Dummy Applications
    const applications = [
        { id: 1, seeker: "John Doe", job: "React Developer", status: "Pending", appliedOn: "2025-08-10" },
        { id: 2, seeker: "Sarah Khan", job: "Node.js Developer", status: "Approved", appliedOn: "2025-08-05" },
        { id: 3, seeker: "Ayesha Ali", job: "UI Designer", status: "Rejected", appliedOn: "2025-08-07" },
        { id: 4, seeker: "Michael Smith", job: "MERN Stack Engineer", status: "Pending", appliedOn: "2025-08-14" },
    ];

    // Dummy Downloads
    const downloads = [
        { id: 1, type: "Full User Data", size: "2.3MB", date: "2025-08-01", format: "CSV" },
        { id: 2, type: "Applications Export", size: "1.1MB", date: "2025-08-15", format: "Excel" },
        { id: 3, type: "Active Profiles", size: "800KB", date: "2025-08-20", format: "PDF" },
        { id: 4, type: "Inactive Users", size: "650KB", date: "2025-08-18", format: "CSV" },
    ];

    // Filtering profiles
    const filteredProfiles = profiles.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) &&
            (locationFilter === "All Locations" || p.location === locationFilter)
    );

    // Handle export action
    // const handleExport = (type) => {
    //     setExporting(true);
    //     // Simulate export process
    //     setTimeout(() => {
    //         setExporting(false);
    //         // Show success notification (you could use a toast library here)
    //         alert(`${type} export completed successfully!`);
    //     }, 1500);
    // };
    const handleExport = async (type) => {
        setExporting(true);

        try {
            if (type === "CSV") {
                // Use native fetch for blob
                const response = await fetch(
                    "http://localhost:5000/api/v1/admin/jobseeker/exports/csv",
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch CSV");

                const blob = await response.blob(); // get CSV as blob
                const url = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "active_profiles.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Optional: show backend message from headers
                const successMsg = response.headers.get("X-Message") || "CSV export completed!";
                alert(successMsg);
            } else if (type === "PDF") {
                alert("PDF export coming soon...");
            }
        } catch (err) {
            console.error("CSV export failed:", err);
            alert("Something went wrong while exporting CSV.");
        } finally {
            setExporting(false);
        }
    };



    // Handle download action
    const handleDownload = (id) => {
        setDownloading(id);
        // Simulate download process
        setTimeout(() => {
            setDownloading(null);
            // Show success notification
            alert("Download completed!");
        }, 1000);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const tabVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
    };




    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg mr-3">📊</span>
                        Reports & Export Dashboard
                    </h2>
                    <p className="text-gray-600">Manage and export job seeker data with ease</p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm w-fit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {[
                        { id: "profiles", label: "Export Active Profiles", icon: "👨‍💻" },
                        { id: "applications", label: "Application Reports", icon: "📑" },
                        { id: "download", label: "Download Data", icon: "⬇️" }
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${activeTab === tab.id
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </motion.button>
                    ))}
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* Active Profiles */}
                    {activeTab === "profiles" && (
                        <motion.div
                            key="profiles"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 flex items-center">
                                        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">👨‍💻</span>
                                        Export Active Profiles
                                    </h3>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleExport("CSV")}
                                            disabled={exporting}
                                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium flex items-center disabled:opacity-50"
                                        >
                                            {exporting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Exporting...
                                                </>
                                            ) : (
                                                "Export All as CSV"
                                            )}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => handleExport("PDF")}
                                            disabled={exporting}
                                            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium disabled:opacity-50"
                                        >
                                            Export All as PDF
                                        </motion.button>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by name..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <select
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                    >
                                        <option>All Locations</option>
                                        {allLoc?.data?.map((loc, index) => (
                                            <option key={index} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <p className="mb-4 text-sm text-gray-500">Total Filtered: <b>{filteredProfiles.length}</b> / {profiles.length}</p>

                                <motion.div
                                    className="overflow-x-auto rounded-lg border border-gray-200"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th> */}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience  Level</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredProfiles
                                                ?.sort(
                                                    (a, b) =>
                                                        new Date(b.lastSignInTime) - new Date(a.lastSignInTime)
                                                )
                                                // ?.slice(0, 8)
                                                ?.map((profile) => (
                                                    <motion.tr
                                                        key={profile._id}
                                                        variants={itemVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        whileHover="hover"
                                                        exit={{ opacity: 0, x: -20 }}
                                                        layout
                                                        className="hover:bg-gray-50 transition duration-200"
                                                    >
                                                        {/* Avatar + Name */}
                                                        <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                                                            <div className="relative">
                                                                <motion.div
                                                                    className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <FiUser className="w-5 h-5 text-indigo-600" />
                                                                </motion.div>
                                                                {profile.status === "Active" && (
                                                                    <motion.div
                                                                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        transition={{ type: "spring", stiffness: 500 }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 flex items-center">
                                                                    {profile.name}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        {/* Experience */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {profile.email}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            sdfsdf {profile.experienceLevel}
                                                        </td>

                                                        {/* Location */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            {profile.location}
                                                        </td>

                                                        {/* Skills */}
                                                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                            <div className="flex flex-wrap gap-1">
                                                                {profile.skills.map((skill, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-2 py-0.5 text-xs rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td> */}

                                                        {/* Last Sign-in */}
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                            <p className="text-gray-900 flex items-center justify-end">
                                                                <FiClock className="mr-1" size={14} />
                                                                {profile.lastActive.split("\n")[0]} {/* 05:09 PM */}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {profile.lastActive.split("\n")[1]} {/* Thu, Aug 7 */}
                                                            </p>
                                                            <motion.p
                                                                className="text-xs mt-1 text-gray-400"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.3 }}
                                                            >
                                                                {profile.lastActive.split("\n")[2]} {/* 15 days ago */}
                                                            </motion.p>
                                                        </td>

                                                    </motion.tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Application Reports */}
                    {activeTab === "applications" && (
                        <motion.div
                            key="applications"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 flex items-center">
                                        <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">📑</span>
                                        Application Reports
                                    </h3>
                                    <div className="flex gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
                                        >
                                            Generate Full Report
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium"
                                        >
                                            Export as Excel
                                        </motion.button>
                                    </div>
                                </div>

                                <p className="mb-4 text-sm text-gray-500">Total Applications: <b>{applications.length}</b></p>

                                <motion.div
                                    className="overflow-x-auto rounded-lg border border-gray-200"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seeker</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Job</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {applications.map((a, index) => (
                                                <motion.tr
                                                    key={a.id}
                                                    variants={itemVariants}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{a.seeker}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{a.job}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{a.appliedOn}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {a.status === "Approved" ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                                                        ) : a.status === "Rejected" ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Download Data */}
                    {activeTab === "download" && (
                        <motion.div
                            key="download"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 flex items-center">
                                        <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">⬇️</span>
                                        Download Data
                                    </h3>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium"
                                    >
                                        Download All Data
                                    </motion.button>
                                </div>

                                <p className="mb-4 text-sm text-gray-500">Available Files: <b>{downloads.length}</b></p>

                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {downloads.map((d, index) => (
                                        <motion.div
                                            key={d.id}
                                            variants={itemVariants}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ y: -5 }}
                                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="font-medium text-gray-800">{d.type}</h4>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">{d.format}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-sm text-gray-500">{d.size}</span>
                                                <span className="text-sm text-gray-500">{d.date}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDownload(d.id)}
                                                    disabled={downloading === d.id}
                                                    className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center"
                                                >
                                                    {downloading === d.id ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Downloading...
                                                        </>
                                                    ) : (
                                                        "Download"
                                                    )}
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                                                >
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ExportData;