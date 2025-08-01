import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { JobSeekerDashboardContext } from "../../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider";
import useJobSeekerProfiles from "../../../../../../../Hooks/userJobSeekerProfile";
import { AuthContext } from "../../../../../../../Context/AuthContextProvider";
import { postMethod } from "../../../../../../../Utils/Api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SuspendedProfilesPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [profilesPerPage] = useState(10);
    const [expandedProfile, setExpandedProfile] = useState(null);
    const [notifiedProfiles, setNotifiedProfiles] = useState([]);

    const { suspenedProfile } = useContext(JobSeekerDashboardContext);
    const { user } = useContext(AuthContext);
    const { profiles } = useJobSeekerProfiles();

    console.log("USER Frm sus", user);

    // Filter out suspended profiles from complete profiles
    const completedProfiles =
        profiles?.filter(
            (item1) =>
                !suspenedProfile?.data?.some((item2) => item2._id === item1._id)
        ) || [];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Fetch notified profiles when tab is active
    useEffect(() => {
        if (activeTab === "notified") {
            const fetchNotifiedProfiles = async () => {
                try {
                    setLoading(true);
                    const response = await fetch(
                        "http://localhost:5000/api/v1/admin/job-seeker/all/incomplete-with-notification",
                        {
                            credentials: "include",
                        }
                    );
                    const data = await response.json();
                    if (data.success) {
                        setNotifiedProfiles(data.data);
                    }
                } catch (error) {
                    console.error("Error fetching notified profiles:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchNotifiedProfiles();
        }
    }, [activeTab]);

    // Stats calculation
    const suspendedCount = suspenedProfile?.data?.length || 0;
    const completedCount = completedProfiles.length;
    const totalProfiles = profiles?.length || 0;
    const completionPercentage =
        totalProfiles > 0 ? Math.round((completedCount / totalProfiles) * 100) : 0;

    // Chart data
    const chartData = {
        labels: ["Completed Profiles", "Suspended Profiles"],
        datasets: [
            {
                label: "Count",
                data: [completedCount, suspendedCount],
                backgroundColor: ["rgba(16, 185, 129, 0.7)", "rgba(239, 68, 68, 0.7)"],
            },
        ],
    };

    useEffect(() => {
        if (!user) {
            console.log("User is not logged in yet.");
        }
    }, [user]);

    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [sentNotifications, setSentNotifications] = React.useState([]);

    const handleNotification = async (jobSeekerId) => {
        if (!user) {
            alert("User not authenticated.");
            return;
        }
        if (!message || !type) {
            alert("Please provide a message and select a notification type.");
            return;
        }

        const isDuplicate = sentNotifications.some(
            (notif) =>
                notif.message === message.trim() &&
                notif.type === type &&
                notif.recipientId === jobSeekerId
        );

        if (isDuplicate) {
            alert("This notification has already been sent.");
            return;
        }

        const notificationData = { message, type };

        try {
            setLoading(true);
            const url = `http://localhost:5000/api/v1/admin/send-notification/job-seeker/${jobSeekerId}`;

            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(notificationData),
            });

            const responseData = await response.json();

            if (response.status === 201 && responseData.success) {
                alert("Notification sent successfully.");
                setMessage('');
                setType('');
                setSentNotifications([
                    ...sentNotifications,
                    { message: message.trim(), type, recipientId: jobSeekerId },
                ]);
                const modal = document.getElementById('notification_modal');
                if (modal && modal.close) modal.close();
            } else if (response.status === 409) {
                alert("Duplicate Notification: " + (responseData.message || 'This notification was already sent.'));
            } else {
                alert("Notification was not successful: " + (responseData.message || 'Unknown error'));
            }
        } catch (error) {
            alert("Failed to send notification: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter profiles based on active tab
    const filteredProfiles =
        activeTab === "all"
            ? suspenedProfile?.data || []
            : activeTab === "notified"
                ? notifiedProfiles
                : (suspenedProfile?.data || []).filter((p) => !p.isProfileComplete);

    // Pagination logic
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = filteredProfiles.slice(
        indexOfFirstProfile,
        indexOfLastProfile
    );
    const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

    const toggleExpandProfile = (id) => {
        setExpandedProfile(expandedProfile === id ? null : id);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="suspended-profile-page p-6 max-w-7xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-8 text-gray-800"
            >
                Suspended Job Seeker Profiles
            </motion.h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500"
                >
                    <h3 className="text-gray-500 font-medium">Total Profiles</h3>
                    <p className="text-3xl font-bold text-gray-800">{totalProfiles}</p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500"
                >
                    <h3 className="text-gray-500 font-medium">Completed Profiles</h3>
                    <p className="text-3xl font-bold text-gray-800">{completedCount}</p>
                    <p className="text-sm text-gray-500">
                        {completionPercentage}% completion rate
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500"
                >
                    <h3 className="text-gray-500 font-medium">Suspended Profiles</h3>
                    <p className="text-3xl font-bold text-gray-800">{suspendedCount}</p>
                    <p className="text-sm text-gray-500">
                        {suspendedCount > 0
                            ? Math.round((suspendedCount / totalProfiles) * 100)
                            : 0}
                        % suspension rate
                    </p>
                </motion.div>
            </div>

            {/* Chart */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-md mb-8"
            >
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Profile Statistics
                </h3>
                <div className="h-64">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: "top",
                                },
                            },
                        }}
                    />
                </div>
            </motion.div>

            {/* Filter Tabs and Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex space-x-2">
                    {["all", "notified", "incomplete"].map((tab) => (
                        <motion.button
                            key={tab}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setActiveTab(tab);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded-md font-medium ${activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-700"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </motion.button>
                    ))}
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                {activeTab === "notified" ? (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notification Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message
                                        </th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Suspension Reason
                                        </th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentProfiles.map((profile) => (
                                <React.Fragment key={profile._id}>
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => toggleExpandProfile(profile._id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {profile.name?.charAt(0) || "U"}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {profile.name || "Unknown"}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {profile.location || "Not specified"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {profile.email || "No email"}
                                        </td>
                                        {activeTab === "notified" ? (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {profile.notifications?.[0]?.type || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${profile.notifications?.[0]?.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : profile.notifications?.[0]?.status === "read"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                            }`}
                                                    >
                                                        {profile.notifications?.[0]?.status || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {profile.notifications?.[0]?.message || "N/A"}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${profile.isProfileComplete
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {profile.isProfileComplete ? "Complete" : "Incomplete"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {profile.suspensionReason || "Not specified"}
                                                </td>
                                            </>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    alert(`Reactivating ${profile.name}'s profile`);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                            >
                                                Reactivate
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    alert(`Viewing ${profile.name}'s details`);
                                                }}
                                                className="text-gray-600 hover:text-gray-900"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </motion.tr>

                                    {/* Expanded Row */}
                                    <AnimatePresence>
                                        {expandedProfile === profile._id && (
                                            <motion.tr
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-gray-50"
                                            >
                                                <td colSpan={activeTab === "notified" ? 6 : 5} className="px-6 py-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Profile Details
                                                            </h4>
                                                            <div className="space-y-2 text-sm text-gray-700">
                                                                <p>
                                                                    <span className="font-medium">Skills:</span>{" "}
                                                                    {profile.skills?.join(", ") ||
                                                                        "Not specified"}
                                                                </p>
                                                                <p>
                                                                    <span className="font-medium">
                                                                        Experience:
                                                                    </span>{" "}
                                                                    {profile.experienceLevel || "Not specified"}
                                                                </p>
                                                                <p>
                                                                    <span className="font-medium">
                                                                        Suspended On:
                                                                    </span>{" "}
                                                                    {profile.suspensionDate || "Unknown date"}
                                                                </p>
                                                                {activeTab === "notified" && profile.notifications?.length > 0 && (
                                                                    <div className="mt-4">
                                                                        <h5 className="font-medium text-gray-900 mb-2">
                                                                            Notification Details
                                                                        </h5>
                                                                        <div className="space-y-2">
                                                                            <p>
                                                                                <span className="font-medium">Type:</span>{" "}
                                                                                {profile.notifications[0].type}
                                                                            </p>
                                                                            <p>
                                                                                <span className="font-medium">Sent At:</span>{" "}
                                                                                {new Date(profile.notifications[0].timestamp).toLocaleString()}
                                                                            </p>
                                                                            <p>
                                                                                <span className="font-medium">Message:</span>{" "}
                                                                                {profile.notifications[0].message}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Admin Actions
                                                            </h4>
                                                            <div className="mt-4 flex flex-wrap gap-3">
                                                                {/* Notification Modal Trigger */}
                                                                <button
                                                                    className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                                                                    onClick={() =>
                                                                        document
                                                                            .getElementById("notification_modal")
                                                                            .showModal()
                                                                    }
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-2"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                                        />
                                                                    </svg>
                                                                    Send Notification
                                                                </button>

                                                                {/* Notification Modal */}
                                                                <dialog
                                                                    id="notification_modal"
                                                                    className="modal backdrop-blur-sm"
                                                                >
                                                                    <div className="modal-box max-w-md bg-white rounded-xl shadow-xl">
                                                                        <div className="flex justify-between items-center mb-4">
                                                                            <h3 className="text-xl font-bold text-gray-800">
                                                                                Send Notification
                                                                            </h3>
                                                                            <button
                                                                                onClick={() =>
                                                                                    document
                                                                                        .getElementById(
                                                                                            "notification_modal"
                                                                                        )
                                                                                        .close()
                                                                                }
                                                                                className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-gray-600"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        </div>

                                                                        <form
                                                                            onSubmit={(e) => {
                                                                                e.preventDefault();
                                                                                handleNotification(profile._id);
                                                                            }}
                                                                            method="dialog"
                                                                            className="space-y-5"
                                                                        >
                                                                            <div className="space-y-2">
                                                                                <label className="block text-sm font-medium text-gray-700">
                                                                                    Message
                                                                                    <span className="ml-1 text-xs text-gray-400">(Optional)</span>
                                                                                </label>
                                                                                <div className="relative">
                                                                                    <textarea
                                                                                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                                                        placeholder="Enter your notification message..."
                                                                                        rows={4}
                                                                                        maxLength={500}
                                                                                        value={message}
                                                                                        onChange={(e) => setMessage(e.target.value)}
                                                                                    />
                                                                                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded">
                                                                                        <span id="char-count">{message.length}</span>/500
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-2">
                                                                                <label htmlFor="notification-type" className="block text-sm font-medium text-gray-700">
                                                                                    Notification Type
                                                                                </label>
                                                                                <select
                                                                                    id="notification-type"
                                                                                    className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                                                    value={type}
                                                                                    onChange={(e) => setType(e.target.value)}
                                                                                >
                                                                                    <option value="" disabled>Select notification type</option>
                                                                                    <option value="profile_incomplete">
                                                                                        Profile Incomplete
                                                                                    </option>
                                                                                    <option value="account_suspended">
                                                                                        Account Suspended
                                                                                    </option>
                                                                                    <option value="warning">
                                                                                        Warning
                                                                                    </option>
                                                                                </select>
                                                                            </div>

                                                                            <div className="flex justify-end space-x-3 pt-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => document.getElementById('notification_modal')?.close()}
                                                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                <button
                                                                                    type="submit"
                                                                                    disabled={loading || !type}
                                                                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm
        ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                                                                                >
                                                                                    {loading ? "Sending..." : "Send Notification"}
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                    </div>

                                                                    {/* Click outside to close */}
                                                                    <form
                                                                        method="dialog"
                                                                        className="modal-backdrop"
                                                                    >
                                                                        <button>close</button>
                                                                    </form>
                                                                </dialog>

                                                                {/* Mark Complete Button */}
                                                                <button className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-2"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M5 13l4 4L19 7"
                                                                        />
                                                                    </svg>
                                                                    Mark Complete
                                                                </button>

                                                                {/* Export Data Button */}
                                                                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 shadow-sm">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-2"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                        />
                                                                    </svg>
                                                                    Export Data
                                                                </button>

                                                                {/* Delete Profile Button */}
                                                                <button className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 mr-2"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                    Delete Profile
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Pagination */}
            {filteredProfiles.length > profilesPerPage && (
                <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            First
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === pageNum
                                        ? "bg-blue-50 text-blue-600 border-blue-500"
                                        : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Last
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default SuspendedProfilesPage;