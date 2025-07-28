import React, { useContext, useState } from 'react'
import { JobSeekerDashboardContext } from '../../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';
import { FiClock, FiMail, FiUser, FiCheckCircle } from 'react-icons/fi';
import useJobSeekerProfiles from '../../../../../../../Hooks/userJobSeekerProfile';
import { motion, AnimatePresence } from 'framer-motion';

const RecentSignInActivity = () => {
    const { stats, active_profile, completeness } = useContext(JobSeekerDashboardContext);
    const { profiles } = useJobSeekerProfiles();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
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
        },
        hover: {
            scale: 1.02,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
            transition: { duration: 0.3 }
        }
    };

    const headerVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const badgeVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
                whileHover={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.05)" }}
            >
                <motion.div
                    className="flex justify-between items-center mb-6"
                    variants={containerVariants}
                >
                    <motion.h3
                        className="text-lg font-semibold text-gray-900"
                        variants={headerVariants}
                    >
                        Recent Sign-In Activity
                    </motion.h3>
                    <motion.span
                        className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
                        variants={badgeVariants}
                    >
                        Last 7 days
                    </motion.span>
                </motion.div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {profiles
                            ?.sort((a, b) => new Date(b.lastSignInTime) - new Date(a.lastSignInTime))
                            ?.slice(0, 5)
                            ?.map((profile) => (
                                <motion.div
                                    key={profile._id}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition duration-200 border border-gray-100"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    exit={{ opacity: 0, x: -20 }}
                                    layout
                                >
                                    <div className="flex items-center space-x-4">
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
                                                {profile.profileCompletion >= 90 && (
                                                    <motion.span
                                                        className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full flex items-center"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        <FiCheckCircle className="mr-1" size={12} />
                                                        Complete
                                                    </motion.span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center">
                                                <FiMail className="mr-1" size={12} />
                                                {profile.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900 flex items-center justify-end">
                                            <FiClock className="mr-1" size={14} />
                                            {new Date(profile.lastSignInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(profile.lastSignInTime).toLocaleDateString([], {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <motion.p
                                            className="text-xs mt-1 text-gray-400"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {Math.floor((new Date() - new Date(profile.lastSignInTime)) / (1000 * 60 * 60))} hours ago
                                        </motion.p>
                                    </div>
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>

                <motion.div
                    className="mt-4 text-right"
                    whileHover={{ x: 5 }}
                >
                    <motion.button
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-end w-full"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        View all activity
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default RecentSignInActivity;