import React from 'react';

const SuspendedProfileOverview = ({ profile }) => {
    return (
        <div className="profile-overview bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Profile Overview</h3>
            <div className="space-y-3">
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
                    <span className="text-gray-800">{profile.skills.join(", ")}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Experience:</span>
                    <span className="text-gray-800">{profile.experienceLevel}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Profile Complete:</span>
                    <span className={`font-medium ${profile.profileComplete ? 'text-green-600' : 'text-red-600'}`}>
                        {profile.profileComplete ? "Yes" : "No"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SuspendedProfileOverview;
