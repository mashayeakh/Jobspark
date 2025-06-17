import React, { useState } from 'react';

const notifications = [
    { id: 1, message: "New job posted: Frontend Developer" },
    { id: 2, message: "Your application was viewed" },
    { id: 3, message: "Interview scheduled for Backend Engineer" },
];

const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(notifications[0]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-end mb-8">
                <div className="relative">
                    <button
                        className="relative p-2 rounded-full hover:bg-gray-200 transition"
                        onClick={() => setOpen(!open)}
                    >
                        {/* Bell Icon */}
                        <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {/* Notification Count */}
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{notifications.length}</span>
                    </button>
                    {/* Dropdown */}
                    {open && (
                        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-10">
                            <div className="p-4 border-b font-semibold text-gray-700">Notifications</div>
                            <ul>
                                {notifications.map((n) => (
                                    <li
                                        key={n.id}
                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selected.id === n.id ? 'bg-gray-100' : ''}`}
                                        onClick={() => setSelected(n)}
                                    >
                                        {n.message}
                                    </li>
                                ))}
                            </ul>
                            {notifications.length === 0 && (
                                <div className="p-4 text-gray-400 text-sm">No notifications</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-8">
                {/* Notification List */}
                <div className="flex-[2] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">All Notifications</h2>
                    <ul>
                        {notifications.map((n) => (
                            <li
                                key={n.id}
                                className={`p-3 rounded cursor-pointer mb-2 ${selected.id === n.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                                onClick={() => setSelected(n)}
                            >
                                {n.message}
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Notification Details */}
                <div className="flex-[1] bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold mb-4">Details</h2>
                    <div className="text-gray-700">{selected.message}</div>
                </div>
            </div>
        </div>
    );
};

export default NotificationBell;
