import React, { useContext, useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { NotificationContext } from '../../Context/NotificationContextProvider';

const NotificationBell = () => {
    const { notification, fetchingNotification } = useContext(NotificationContext);
    const [open, setOpen] = useState(false);

    // Count unread notifications
    const unreadCount = notification?.filter(n => !n.isRead)?.length || 0;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-end mb-8">
                <div className="relative">
                    {/* Bell button */}
                    <button onClick={() => setOpen(!open)} className="relative">
                        <FaRegBell className="text-2xl text-primary" />

                        {/* Badge */}
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
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
                                            className="px-4 py-2 hover:bg-gray-100 text-sm border-b"
                                        >
                                            {n.message}
                                        </li>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-gray-500 text-sm">
                                        No notifications
                                    </div>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Optional full notification list + details */}
            <div className="flex gap-8">
                <div className="flex-[2] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">All Notifications</h2>
                    <ul>
                        {notification?.map((n) => (
                            <li
                                key={n._id}
                                className="p-3 rounded cursor-pointer mb-2 hover:bg-gray-50 border-l-4 border-blue-500"
                            >
                                {n.message}
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
