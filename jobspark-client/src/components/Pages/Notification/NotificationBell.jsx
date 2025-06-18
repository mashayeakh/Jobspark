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
    }, [selectedNotification]);



    console.log("Details", showDetails);

    console.log("selectedNotification", selectedNotification);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-end mb-8">
                <div className="relative">
                    <button onClick={() => setOpen(!open)} className="text-2xl">
                        <FaRegBell />
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
                            <div className="p-3 font-semibold border-b">Notifications</div>
                            <ul>
                                {notification?.length > 0 ? (
                                    notification.slice(0, 5).map((n) => (
                                        <li
                                            key={n._id}
                                            onClick={() => handleNotificationClick(n)}
                                            className="px-4 py-2 hover:bg-gray-100 text-sm border-b cursor-pointer"
                                        >
                                            <p>{n.message}</p>
                                            <span className="text-xs text-gray-500">{dayjs(n.createdAt).fromNow()}</span>
                                        </li>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500 text-sm">No notifications</div>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-8 w-full">
                {/* All Notifications */}
                <div className="flex-[2] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">All Notifications</h2>
                    <ul>
                        {notification?.map((n) => (
                            <li
                                key={n._id}
                                onClick={() => handleNotificationClick(n)}
                                className={`p-3 rounded cursor-pointer mb-2 hover:bg-gray-50 border-l-4 ${selectedNotification?._id === n._id ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                                    }`}
                            >
                                <p>{n.message}</p>
                                <span className="text-xs text-gray-500">{dayjs(n.createdAt).fromNow()}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Details Section */}
                <div className="flex-[1] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">Details</h2>
                    {showDetails && showDetails.length > 0 ? (
                        showDetails.map((detail, index) => (
                            <div key={index} className="text-sm space-y-2 mb-4 border-b pb-2">
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
                        <p className="text-gray-500">Click a notification to view its details.</p>
                    )}


                </div>
            </div>
        </div>
    );
};

export default NotificationBell;
