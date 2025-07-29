import React from 'react';

const SuspensionDetails = ({ profile }) => {
    return (
        <div className="suspension-details bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Suspension Details</h3>
            <div className="space-y-3">
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Suspension Date:</span>
                    <span className="text-gray-800">{profile.suspensionDate || "Not Available"}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Reason for Suspension:</span>
                    <span className="text-gray-800">{profile.suspensionReason || "No reason provided"}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Suspended By:</span>
                    <span className="text-gray-800">{profile.suspendedBy || "Admin"}</span>
                </div>
            </div>
        </div>
    );
};

export default SuspensionDetails;
