import React, { useContext, useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { AuthContext } from '../../Context/AuthContextProvider';
import { getMethod } from '../../Utils/Api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';

dayjs.extend(relativeTime);

const NotificationBell = () => {
    const [selectedNotification, setSelectedNotification] = useState(null);
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [bellShake, setBellShake] = useState(false);

    const fetchAllJobSeekerNotifications = async () => {
        setIsLoading(true);
        try {
            const url = `http://localhost:5000/api/v1/jobseeker/notification/${user?._id}`;
            const response = await getMethod(url);
            setNotifications(response.data);

            // Shake the bell if there are new notifications
            if (response.data.length > 0) {
                setBellShake(true);
                setTimeout(() => setBellShake(false), 1000);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "job_seeker" && user?._id) {
            fetchAllJobSeekerNotifications();
        }
    }, [user?._id]);

    const handleNotificationClick = (n) => {
        setSelectedNotification(n);
    };

    const notificationVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        exit: { opacity: 0, x: 20 }
    };

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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 p-8"
        >
            <div className="flex items-center justify-between mb-6">
                <motion.h2
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-2xl font-bold text-gray-800"
                >
                    Your Notifications
                </motion.h2>

                <motion.div
                    animate={bellShake ? {
                        rotate: [0, -15, 15, -15, 15, 0],
                        transition: { duration: 0.6 }
                    } : {}}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={fetchAllJobSeekerNotifications}
                    className="p-3 bg-white rounded-full shadow-md cursor-pointer"
                >
                    <FaRegBell className="text-gray-600 text-xl" />
                    {notifications.length > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        >
                            {notifications.length}
                        </motion.span>
                    )}
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex bg-white shadow-lg rounded-xl overflow-hidden"
            >
                {/* Left side - Notification List */}
                <div className="w-1/3 border-r max-h-[80vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 flex justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : notifications?.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="divide-y divide-gray-200"
                        >
                            <AnimatePresence>
                                {notifications.map((n) => (
                                    <motion.div
                                        key={n._id}
                                        variants={notificationVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        onClick={() => handleNotificationClick(n)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedNotification?._id === n._id ? 'bg-blue-50' : ''}`}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <div className="flex items-start">
                                            <motion.div
                                                animate={selectedNotification?._id === n._id ?
                                                    { backgroundColor: "#3b82f6" } :
                                                    { backgroundColor: "#e5e7eb" }
                                                }
                                                className="h-2 w-2 rounded-full mt-1 mr-2"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{n.message}</p>
                                                <div className="text-xs text-gray-500 flex justify-between mt-1">
                                                    <span>{dayjs(n.createdAt).fromNow()}</span>
                                                    <span className={`italic ${n.source === 'admin' ? 'text-blue-500' : 'text-gray-400'}`}>
                                                        {n.source === 'admin' ? 'From Admin' : 'System'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 text-gray-500 text-sm text-center"
                        >
                            No notifications yet
                        </motion.p>
                    )}
                </div>

                {/* Right side - Notification Details */}
                <div className="w-2/3 p-6 bg-gray-50">
                    <AnimatePresence mode="wait">
                        {selectedNotification ? (
                            <motion.div
                                key={selectedNotification._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-6 rounded-lg shadow-sm"
                            >
                                <div className="flex items-center mb-4">
                                    <div className={`h-3 w-3 rounded-full mr-2 ${selectedNotification.source === 'admin' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                    <h3 className="text-lg font-bold text-gray-800">Notification Details</h3>
                                </div>

                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-md mb-4 text-gray-700">{selectedNotification.message}</p>
                                </motion.div>

                                <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
                                    <div className="flex">
                                        <span className="font-semibold w-24">Type:</span>
                                        <span className="capitalize">{selectedNotification.type}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-24">From:</span>
                                        <span className={`${selectedNotification.source === 'admin' ? 'text-blue-500' : 'text-gray-500'}`}>
                                            {selectedNotification.source === 'admin' ? 'Admin' : 'System'}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        <span className="font-semibold w-24">Received:</span>
                                        <span>{dayjs(selectedNotification.createdAt).format('MMM DD, YYYY h:mm A')}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full text-gray-400"
                            >
                                <FaRegBell className="text-4xl mb-4" />
                                <p className="text-lg">Select a notification to view details</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NotificationBell;