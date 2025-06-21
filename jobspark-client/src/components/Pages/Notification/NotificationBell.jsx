import React, { useContext, useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { NotificationContext } from '../../Context/NotificationContextProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    dayjs.extend(relativeTime);

    const { notification, fetchNotificationDetails } = useContext(NotificationContext);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showDetails, setShowDetails] = useState(null);

    const handleNotificationClick = (n) => {
        setSelectedNotification(n);
        setOpen(false);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!selectedNotification) return;
            const recruiterId = selectedNotification.userId;
            const applicantId = selectedNotification.applicantId;
            if (!recruiterId || !applicantId) return;
            const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/applicant/${applicantId}/details`;
            try {
                const data = await fetchNotificationDetails(url);
                setShowDetails(data);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };
        fetchDetails();
    }, [selectedNotification, fetchNotificationDetails]);


    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-end mb-8">
                <div className="relative">
                    {open && (
                        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 animate-fade-in">
                            <div className="p-3 font-semibold border-b flex justify-between items-center">
                                Notifications
                                <button className="text-xs text-blue-600 hover:underline">Mark all as read</button>
                            </div>
                            <ul>
                                {notification?.length > 0 ? (
                                    notification.slice(0, 5).map((n) => (
                                        <li
                                            key={n._id}
                                            onClick={() => handleNotificationClick(n)}
                                            className={`px-4 py-2 hover:bg-gray-100 text-sm border-b cursor-pointer flex items-center gap-2 ${!n.read ? 'bg-blue-50 font-semibold' : ''
                                                }`}
                                        >
                                            <span className="w-2 h-2 rounded-full mr-2" style={{ background: n.read ? 'transparent' : '#3b82f6' }}></span>
                                            <div>
                                                <p>{n.message}</p>
                                                <span className="text-xs text-gray-500">{dayjs(n.createdAt).fromNow()}</span>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500 text-sm">No notifications</div>
                                )}
                            </ul>
                            <div className="text-center py-2">
                                <button className="text-blue-600 text-xs hover:underline">View all</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-8 w-full">
                {/* All Notifications */}
                <div className="flex-[2] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">All Notifications</h2>
                    <ul>
                        {notification?.map((n, idx) => (
                            <li
                                key={n._id}
                                onClick={() => handleNotificationClick(n)}
                                className={`p-3 rounded cursor-pointer mb-2 flex items-center gap-2 border-l-4 transition-all ${selectedNotification?._id === n._id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-transparent'
                                    } ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}
                            >
                                <span className="w-2 h-2 rounded-full" style={{ background: n.read ? 'transparent' : '#3b82f6' }}></span>
                                <div>
                                    <p>{n.message}</p>
                                    <span className="text-xs text-gray-500">{dayjs(n.createdAt).fromNow()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Details Section */}
                <div className="flex-[1] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">Details</h2>
                    {showDetails && showDetails.length > 0 ? (
                        showDetails.map((detail, index) => (
                            <div key={index} className="text-sm space-y-2 mb-4 border-b pb-2 bg-gray-50 rounded p-3 shadow">
                                <p><strong>Date:</strong> {detail["Date"]}</p>
                                <p><strong>Type:</strong> {detail["Type"]}</p>
                                <p><strong>Candidate:</strong> {detail["Candidate"]}</p>
                                <p><strong>Interview Date:</strong> {detail["Interview Date"]}</p>
                                <p>
                                    <strong>Location:</strong> {detail["Location"]} —{" "}
                                    <a
                                        href={detail["InterviewLink"]}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        Join Link
                                    </a>
                                </p>
                                <p><strong>Interviewer:</strong> {detail["Interviewer"]}</p>
                                <p><strong>Notes:</strong> {detail["Notes"]}</p>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 10-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 006 19h12a1 1 0 00.71-1.71L18 16z" fill="#cbd5e1" />
                            </svg>
                            <p className="mt-2">Click a notification to view its details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationBell
