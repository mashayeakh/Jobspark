import React from 'react';
import { motion } from 'framer-motion';

const ApplicationAndActivity = ({ profile }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="applications-activity bg-white rounded-lg p-6 mb-6"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Applications & Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-gray-600 font-medium mb-2">Applications:</p>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                    >
                        <p className="text-3xl font-bold text-blue-600">{profile.applications}</p>
                        <p className="text-sm text-blue-800">jobs applied</p>
                    </motion.div>
                </div>
                <div>
                    <p className="text-gray-600 font-medium mb-2">Recent Activity:</p>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                        <p className="text-gray-800">{profile.recentActivity}</p>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-gray-500 text-sm mt-2"
                        >
                            Last updated: {new Date().toLocaleDateString()}
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ApplicationAndActivity;