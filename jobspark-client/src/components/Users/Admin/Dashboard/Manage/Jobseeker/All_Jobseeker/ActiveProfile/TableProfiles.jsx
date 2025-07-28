import React, { useState } from 'react'
import useJobSeekerProfiles from '../../../../../../../Hooks/userJobSeekerProfile';
import { FiBell, FiEye, FiUser, FiXCircle, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const TableProfiles = () => {
    const { profiles, active_profile, completePro } = useJobSeekerProfiles();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [experienceFilter, setExperienceFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 10;


    console.log("C ", completePro);


    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const tableRow = {
        hover: {
            scale: 1.01,
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
            transition: { duration: 0.2 }
        },
        tap: {
            scale: 0.995
        }
    };

    const progressBar = {
        initial: { width: 0 },
        animate: (width) => ({
            width: `${width}%`,
            transition: { duration: 0.8, type: "spring" }
        })
    };

    const buttonHover = {
        scale: 1.05,
        transition: { duration: 0.2 }
    };

    const buttonTap = {
        scale: 0.95
    };

    const paginationButton = {
        hover: {
            backgroundColor: "#6366F1",
            color: "#FFFFFF"
        },
        tap: { scale: 0.95 }
    };

    // Filter profiles based on search and filters
    const filteredProfiles = completePro?.filter(profile => {
        const matchesSearch = profile?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || profile?.status === statusFilter;
        const matchesExperience = experienceFilter === 'All' ||
            profile?.experienceLevel.includes(experienceFilter);

        return matchesSearch && matchesStatus && matchesExperience;
    });

    // Pagination
    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = filteredProfiles?.slice(indexOfFirstProfile, indexOfLastProfile);
    const totalPages = Math.ceil(filteredProfiles?.length / profilesPerPage);

    const handleProfileAction = (action, profileId) => {
        const profileToUpdate = profiles.find(p => p._id === profileId);
        if (!profileToUpdate) return;

        let message = "";
        switch (action) {
            case "Promote to Active":
                setProfiles(profiles?.map(p => p._id === profileId ? { ...p, status: "Active" } : p));
                message = `Promoted ${profileToUpdate.name} to Active status.`;
                break;
            case "Deactivate":
                setProfiles(profiles?.map(p => p._id === profileId ? { ...p, status: "Inactive" } : p));
                message = `Deactivated ${profileToUpdate.name}'s profile.`;
                break;
            case "Follow-up with Incomplete Profile":
                message = `Sending follow-up to ${profileToUpdate.name} regarding their incomplete profile.`;
                break;
            case "Send Notification":
                message = `Sending a general notification to ${profileToUpdate.name}.`;
                break;
            case "Export Profile Data":
                message = `Exporting data for ${profileToUpdate.name}.`;
                break;
            case "View Detailed Profile":
                message = `Viewing detailed profile for ${profileToUpdate.name}.`;
                break;
            case "Update Profile Information":
                message = `Opening update form for ${profileToUpdate.name}.`;
                break;
            default:
                message = `Unknown action: ${action}`;
        }
        alert(message);
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
            {/* Header */}
            <motion.div
                className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">Job Seeker Profiles</h2>
                <div className="flex items-center space-x-2">
                    <motion.span
                        className="text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Showing {filteredProfiles?.length} of {profiles?.length} profiles
                    </motion.span>
                </div>
            </motion.div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <motion.tr
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Experience
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Completion
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </motion.tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                            {currentProfiles?.map((profile) => (
                                <motion.tr
                                    key={profile._id}
                                    variants={item}
                                    initial="hidden"
                                    animate="show"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="hover:bg-gray-50 transition duration-150"
                                    layout
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <motion.div
                                                className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                                                whileHover={{ rotate: 10 }}
                                                whileTap={{ rotate: -10, scale: 0.9 }}
                                            >
                                                <FiUser className="h-5 w-5 text-indigo-600" />
                                            </motion.div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                                                <div className="text-sm text-gray-500">{profile.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <motion.span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${profile?.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            {profile?.status}
                                        </motion.span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {profile?.experienceLevel?.split(' ')[0]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                                <motion.div
                                                    className={`h-2.5 rounded-full ${profile.profileCompletion >= 90 ? 'bg-green-500' :
                                                        profile.profileCompletion >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    initial="initial"
                                                    animate="animate"
                                                    custom={profile.profileCompletion}
                                                    variants={progressBar}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{profile.profileCompletion}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <motion.button
                                                onClick={() => handleProfileAction("View Detailed Profile", profile._id)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                                title="View Profile"
                                                whileHover={buttonHover}
                                                whileTap={buttonTap}
                                            >
                                                <FiEye className="h-5 w-5" />
                                            </motion.button>
                                            {profile.status === "Inactive" ? (
                                                <motion.button
                                                    onClick={() => handleProfileAction("Promote to Active", profile._id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Activate Profile"
                                                    whileHover={buttonHover}
                                                    whileTap={buttonTap}
                                                >
                                                    <FiCheckCircle className="h-5 w-5" />
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    onClick={() => handleProfileAction("Deactivate", profile._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Deactivate Profile"
                                                    whileHover={buttonHover}
                                                    whileTap={buttonTap}
                                                >
                                                    <FiXCircle className="h-5 w-5" />
                                                </motion.button>
                                            )}
                                            {profile.profileCompletion < 90 && (
                                                <motion.button
                                                    onClick={() => handleProfileAction("Follow-up with Incomplete Profile", profile._id)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                    title="Follow Up"
                                                    whileHover={buttonHover}
                                                    whileTap={buttonTap}
                                                >
                                                    <FiAlertCircle className="h-5 w-5" />
                                                </motion.button>
                                            )}
                                            <motion.button
                                                onClick={() => handleProfileAction("Send Notification", profile._id)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Send Notification"
                                                whileHover={buttonHover}
                                                whileTap={buttonTap}
                                            >
                                                <FiBell className="h-5 w-5" />
                                            </motion.button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <motion.div
                className="px-6 py-4 flex justify-between items-center border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <motion.button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 flex items-center space-x-1 border rounded-md disabled:opacity-50"
                    whileHover={currentPage !== 1 ? paginationButton : {}}
                    whileTap={currentPage !== 1 ? buttonTap : {}}
                >
                    <FiChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                </motion.button>

                <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <motion.button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-3 py-1 border rounded-md ${currentPage === index + 1 ? 'bg-indigo-500 text-white' : ''}`}
                            whileHover={paginationButton}
                            whileTap={buttonTap}
                            custom={currentPage === index + 1}
                            animate={{
                                backgroundColor: currentPage === index + 1 ? "#6366F1" : "#FFFFFF",
                                color: currentPage === index + 1 ? "#FFFFFF" : "#000000"
                            }}
                        >
                            {index + 1}
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 flex items-center space-x-1 border rounded-md disabled:opacity-50"
                    whileHover={currentPage !== totalPages ? paginationButton : {}}
                    whileTap={currentPage !== totalPages ? buttonTap : {}}
                >
                    <span>Next</span>
                    <FiChevronRight className="h-4 w-4" />
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default TableProfiles;