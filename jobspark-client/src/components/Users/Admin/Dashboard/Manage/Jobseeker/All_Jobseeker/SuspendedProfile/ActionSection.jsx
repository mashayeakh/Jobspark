import React from 'react';
import { motion } from 'framer-motion';

const ActionSection = ({ profile }) => {
    const actions = [
        {
            label: "Reactivate Profile",
            color: "bg-green-600 hover:bg-green-700",
            onClick: () => alert(`Reactivating ${profile.name}'s profile`)
        },
        {
            label: "Send Notification",
            color: "bg-blue-600 hover:bg-blue-700",
            onClick: () => alert(`Sending notification to ${profile.email}`)
        },
        {
            label: "Export Profile Data",
            color: "bg-purple-600 hover:bg-purple-700",
            onClick: () => alert(`Exporting data for ${profile.name}`)
        },
        {
            label: "View Full Profile",
            color: "bg-gray-600 hover:bg-gray-700",
            onClick: () => alert(`Showing full profile of ${profile.name}`)
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="actions-section bg-white rounded-lg p-6"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ y: -3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={action.onClick}
                        className={`${action.color} text-white font-medium py-2 px-4 rounded-md transition duration-200`}
                    >
                        {action.label}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default ActionSection;