import React from 'react';
import { motion } from 'framer-motion';

const SuspensionDetails = ({ profile }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="suspension-details bg-white rounded-lg p-6 mb-6"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Suspension Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Reason:</span>
                    <motion.span
                        whileHover={{ x: 5 }}
                        className="text-red-600 font-medium"
                    >
                        {profile.suspensionReason}
                    </motion.span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Date:</span>
                    <span className="text-gray-800">{profile.suspensionDate}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Suspended By:</span>
                    <span className="text-gray-800">{profile.suspendedBy}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Status:</span>
                    <motion.span
                        animate={{
                            color: profile.profileComplete ? '#10B981' : '#F59E0B',
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="font-medium"
                    >
                        {profile.profileComplete ? "Ready for review" : "Pending completion"}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

export default SuspensionDetails;