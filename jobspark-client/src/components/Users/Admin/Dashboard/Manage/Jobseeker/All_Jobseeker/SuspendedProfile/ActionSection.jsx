import React from 'react';

const ActionSection = ({ profile }) => {
    return (
        <div className="action-section bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Action Section</h3>
            <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white p-3 rounded-md">Promote to Active</button>
                <button className="w-full bg-red-600 text-white p-3 rounded-md">Deactivate Profile</button>
                <button className="w-full bg-gray-600 text-white p-3 rounded-md">Send Notification</button>
                <button className="w-full bg-yellow-600 text-white p-3 rounded-md">View Detailed Profile</button>
            </div>
        </div>
    );
};

export default ActionSection;
