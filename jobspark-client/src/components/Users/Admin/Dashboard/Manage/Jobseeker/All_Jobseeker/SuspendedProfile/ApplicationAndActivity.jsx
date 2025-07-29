import React from 'react';

const ApplicationAndActivity = ({ profile }) => {
    return (
        <div className="application-activity bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Application & Activity</h3>
            <div className="space-y-3">
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Applications Submitted:</span>
                    <span className="text-gray-800">{profile.applications.length}</span>
                </div>
                <div className="flex">
                    <span className="text-gray-600 font-medium w-1/3">Recent Activity:</span>
                    <span className="text-gray-800">{profile.recentActivity || "No recent activity"}</span>
                </div>
            </div>
        </div>
    );
};

export default ApplicationAndActivity;
