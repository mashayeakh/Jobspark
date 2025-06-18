import React, { useContext, useEffect, useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { NotificationContext } from '../../Context/NotificationContextProvider';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // ✅ Correct import


const NotificationBell = () => {
    const [open, setOpen] = useState(false);

    dayjs.extend(relativeTime);


    const { notification, fetchNotificationDetails } = useContext(NotificationContext);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showDetails, setShowDetails] = useState({});

    useEffect(() => {
        // Just picking the first notification for now
        if (notification && notification.length > 0) {
            setSelectedNotification(notification[0]);
        }
    }, [notification]);

    const fetchDetails = async () => {
        if (!selectedNotification) return;

        const recruiterId = selectedNotification.userId;
        const applicantId = selectedNotification.applicantId;

        const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/applicant/${applicantId}/details`;
        console.log("URL:", url);

        try {
            const data = await fetchNotificationDetails(url);
            console.log("Fetched details:", data);
            setShowDetails(data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [selectedNotification]);

    console.log("Show Details ", showDetails);


    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-end mb-8">
                <div className="relative">


                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50">
                            <div className="p-3 font-semibold border-b">Notifications</div>
                            <ul>
                                {notification?.length > 0 ? (
                                    notification.slice(0, 5).map((n) => (
                                        <li
                                            key={n._id}
                                            className="px-4 py-2 hover:bg-gray-100 text-sm border-b"
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

            {/* Optional full notification list + details */}
            <div className="flex gap-8 w-full">
                <div className="flex-[2] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">All Notifications</h2>
                    <ul>
                        {notification?.map((n) => (
                            <li
                                key={n._id}
                                className="p-3 rounded cursor-pointer mb-2 hover:bg-gray-50 border-l-4 border-blue-500"
                            >
                                <p>{n.message}</p>
                                <span className="text-xs text-gray-500">{dayjs(n.createdAt).fromNow()}</span>
                            </li>
                        ))}
                    </ul>

                </div>
                <div className="flex-[1] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">Details</h2>
                    {/* Add detailed view of selected notification here later */}

                </div>
            </div>
        </div>
    );
};

export default NotificationBell;
