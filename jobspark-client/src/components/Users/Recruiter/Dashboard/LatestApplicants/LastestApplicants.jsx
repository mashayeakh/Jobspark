import React, { useEffect, useState } from 'react';

// Optional utility to format date
const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000); // in seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

const LastestApplicants = () => {
    const [applicants, setApplicants] = useState([]);

    // Example fetch function (replace with actual API)
    const fetchApplicants = async () => {
        // Mock data (replace with real fetch from your API)
        const data = [
            {
                _id: '1',
                name: 'Jane Doe',
                jobTitle: 'Frontend Developer',
                appliedAt: '2025-07-17T08:00:00Z',
                status: 'pending',
            },
            {
                _id: '2',
                name: 'John Smith',
                jobTitle: 'Backend Developer',
                appliedAt: '2025-07-17T06:30:00Z',
                status: 'reviewed',
            },
            {
                _id: '3',
                name: 'Aliya Khan',
                jobTitle: 'UI/UX Designer',
                appliedAt: '2025-07-16T16:45:00Z',
                status: 'shortlisted',
            },
        ];

        setApplicants(data);
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    return (
        <div className="w-full bg-white shadow-md rounded-lg p-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Applicants</h2>

            {applicants.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent applicants yet.</p>
            ) : (
                <ul className="space-y-4">
                    {applicants.map((app) => (
                        <li key={app._id} className="flex items-start gap-4 border-b pb-4">
                            <div className="bg-blue-100 rounded-full h-10 w-10 flex items-center justify-center text-blue-700 font-bold">
                                {app.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{app.name}</p>
                                <p className="text-sm text-gray-500">
                                    Applied for <span className="text-gray-700 font-semibold">{app.jobTitle}</span>
                                </p>
                                <p className="text-xs text-gray-400">{formatRelativeTime(app.appliedAt)}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-sm btn-outline-primary">View</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LastestApplicants;

