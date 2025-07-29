import React from 'react';
import { motion } from 'framer-motion';

const SuspendedProfileOverview = ({ profile }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="profile-overview bg-white rounded-lg p-6 mb-6"
        >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Profile Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Name:</span>
                    <span className="text-gray-800">{profile.name}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Email:</span>
                    <span className="text-gray-800">{profile.email}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Location:</span>
                    <span className="text-gray-800">{profile.location}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                        {profile.skills.map((skill, i) => (
                            <motion.span
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Experience:</span>
                    <span className="text-gray-800">{profile.experienceLevel}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Profile Complete:</span>
                    <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                        className={`font-medium ${profile.profileComplete ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {profile.profileComplete ? "Yes" : "No"}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

export default SuspendedProfileOverview;