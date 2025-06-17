import React, { useState } from 'react';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const pushNotification = (message) => {
        const newNotification = {
            message,
            timestamp: new Date(),
            read: false,
        };

        setNotifications((prev) => {
            const updated = [...prev, newNotification];
            setUnreadCount(updated.filter((n) => !n.read).length);
            return updated;
        });
    };

    const handleBellClick = () => {
        setDropdownOpen(!dropdownOpen);

        // Mark all as read
        if (!dropdownOpen) {
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true }))
            );
            setUnreadCount(0);
        }
    };

    return (
        <div className="">
            {/* Notification Bell Button */}
            <button
                onClick={handleBellClick}
                className="relative text-2xl p-2 focus:outline-none"
            >
                🔔
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-md z-10 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">No notifications</div>
                    ) : (
                        notifications
                            .slice()
                            .reverse()
                            .map((n, i) => (
                                <div key={i} className="px-4 py-2 border-b text-sm">
                                    <p>{n.message}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(n.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            ))
                    )}
                </div>
            )}

            {/* Test Trigger Button */}
            <div className="mt-4">
                <button
                    onClick={() =>
                        pushNotification("✅ Meeting with ID 123 starts in 2 days, 3 hours!")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Push Test Notification
                </button>
            </div>
        </div>
    );
};

export default NotificationBell;
