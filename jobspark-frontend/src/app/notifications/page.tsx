"use client";

import { useState } from "react";
import { Check, Settings2, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
    id: string;
    type: "status_change" | "comment" | "assignment";
    project: string;
    projectColor: string;
    issueNumber: number;
    user: {
        name: string;
        avatar: string;
        initials: string;
    };
    action: string;
    timestamp: string;
    isRead: boolean;
}

const dummyNotifications: Notification[] = [
    {
        id: "1",
        type: "status_change",
        project: "Prototyping",
        projectColor: "bg-orange-500",
        issueNumber: 12355,
        user: {
            name: "Joseph Collman",
            avatar: "JC",
            initials: "JC",
        },
        action: "changed the status to In...",
        timestamp: "4m ago",
        isRead: false,
    },
    {
        id: "2",
        type: "status_change",
        project: "Quality Control",
        projectColor: "bg-purple-500",
        issueNumber: 0,
        user: {
            name: "Joseph Collman",
            avatar: "JC",
            initials: "JC",
        },
        action: "changed timeline to...",
        timestamp: "23m ago",
        isRead: false,
    },
    {
        id: "3",
        type: "comment",
        project: "Production",
        projectColor: "bg-green-500",
        issueNumber: 0,
        user: {
            name: "Wayne Smith",
            avatar: "WS",
            initials: "WS",
        },
        action: "replied",
        timestamp: "4h ago",
        isRead: false,
    },
    {
        id: "4",
        type: "status_change",
        project: "Prototyping",
        projectColor: "bg-orange-500",
        issueNumber: 12469,
        user: {
            name: "Anas Rafaat",
            avatar: "AR",
            initials: "AR",
        },
        action: "changed the status to In...",
        timestamp: "6h ago",
        isRead: false,
    },
    {
        id: "5",
        type: "status_change",
        project: "Testing",
        projectColor: "bg-red-500",
        issueNumber: 0,
        user: {
            name: "Tom Labella",
            avatar: "TL",
            initials: "TL",
        },
        action: "changed the status to In...",
        timestamp: "2d ago",
        isRead: true,
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(dummyNotifications);
    const [filter, setFilter] = useState<"unread" | "all">("unread");
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [expandedMarkedAsRead, setExpandedMarkedAsRead] = useState(false);

    const filteredNotifications =
        filter === "unread"
            ? notifications.filter((n) => !n.isRead)
            : notifications;

    const readNotifications = notifications.filter((n) => n.isRead);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    };

    const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
    };

    const openNotificationModal = (notification: Notification) => {
        setSelectedNotification(notification);
    };

    const closeModal = () => {
        setSelectedNotification(null);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Updates</h1>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-gray-700"
                        >
                            <Check className="size-4 mr-2" />
                            Mark all as read
                        </Button>
                        <Button variant="outline" size="icon">
                            <Settings2 className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setFilter("unread")}
                        className={`pb-3 px-1 font-medium transition-colors ${filter === "unread"
                            ? "text-gray-900 border-b-2 border-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Unread <span className="ml-2 text-sm">{unreadCount}</span>
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`pb-3 px-1 font-medium transition-colors ${filter === "all"
                            ? "text-gray-900 border-b-2 border-gray-900"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        All
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-1">
                    {filteredNotifications.map((notification, index) => (
                        <div key={notification.id}>
                            <div
                                className={`p-4 rounded-lg cursor-pointer transition-colors ${notification.isRead
                                    ? "bg-white hover:bg-gray-100"
                                    : "bg-blue-50 hover:bg-blue-100"
                                    }`}
                                onClick={() => openNotificationModal(notification)}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Badges and Issue Number */}
                                    <div className="flex-shrink-0 flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <div
                                                className={`w-2 h-2 rounded-full ${notification.projectColor}`}
                                            ></div>
                                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                        </div>
                                        {notification.issueNumber > 0 && (
                                            <div className="text-sm font-semibold text-gray-900">
                                                #{notification.issueNumber}
                                                <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-700">
                                                    3
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Project and Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-medium px-2 py-1 rounded text-white ${notification.projectColor} bg-opacity-90`}>
                                                {notification.project}
                                            </span>
                                            {notification.project === "Prototyping" && (
                                                <span className="text-xs text-gray-600 font-medium">
                                                    Sample 2
                                                </span>
                                            )}
                                            {notification.project === "Testing" && (
                                                <span className="text-xs text-gray-600 font-medium">
                                                    Initial research
                                                </span>
                                            )}
                                        </div>

                                        {/* User Action */}
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-7 h-7 rounded-full ${notification.user.initials === "JC"
                                                    ? "bg-orange-500"
                                                    : notification.user.initials === "WS"
                                                        ? "bg-purple-600"
                                                        : notification.user.initials === "AR"
                                                            ? "bg-gray-600"
                                                            : "bg-red-600"
                                                    } flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                                            >
                                                {notification.user.initials[0]}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {notification.user.name}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {notification.action}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                                        <span className="text-sm text-gray-600">
                                            {notification.timestamp}
                                        </span>
                                        {!notification.isRead && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-xs h-auto py-1 px-2 text-blue-600 hover:text-blue-700"
                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                            >
                                                Mark read
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {index === filteredNotifications.length - 2 && (
                                <div className="py-2 text-center">
                                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        1 more updates
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Marked as Read Section */}
                    {readNotifications.length > 0 && filter === "all" && (
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <button
                                onClick={() => setExpandedMarkedAsRead(!expandedMarkedAsRead)}
                                className="flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 mb-4"
                            >
                                <ChevronDown
                                    className={`size-4 transition-transform ${expandedMarkedAsRead ? "rotate-180" : ""
                                        }`}
                                />
                                Marked as read ({readNotifications.length})
                            </button>

                            {expandedMarkedAsRead && (
                                <div className="space-y-1">
                                    {readNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="p-4 rounded-lg cursor-pointer transition-colors bg-gray-50 hover:bg-gray-100"
                                            onClick={() => openNotificationModal(notification)}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Badges and Issue Number */}
                                                <div className="flex-shrink-0 flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${notification.projectColor}`}
                                                        ></div>
                                                        <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                                    </div>
                                                    {notification.issueNumber > 0 && (
                                                        <div className="text-sm font-semibold text-gray-600">
                                                            #{notification.issueNumber}
                                                            <span className="ml-1 text-xs bg-gray-300 px-1.5 py-0.5 rounded text-gray-700">
                                                                3
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Project and Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-medium px-2 py-1 rounded text-white ${notification.projectColor} bg-opacity-90`}>
                                                            {notification.project}
                                                        </span>
                                                        {notification.project === "Prototyping" && (
                                                            <span className="text-xs text-gray-600 font-medium">
                                                                Sample 2
                                                            </span>
                                                        )}
                                                        {notification.project === "Testing" && (
                                                            <span className="text-xs text-gray-600 font-medium">
                                                                Initial research
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* User Action */}
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-7 h-7 rounded-full ${notification.user.initials === "JC"
                                                                ? "bg-orange-500"
                                                                : notification.user.initials === "WS"
                                                                    ? "bg-purple-600"
                                                                    : notification.user.initials === "AR"
                                                                        ? "bg-gray-600"
                                                                        : "bg-red-600"
                                                                } flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                                                        >
                                                            {notification.user.initials[0]}
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {notification.user.name}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {notification.action}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Timestamp */}
                                                <div className="flex-shrink-0 text-right">
                                                    <span className="text-sm text-gray-500">
                                                        {notification.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notification Details Modal */}
                {selectedNotification && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
                        <div
                            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-900">Notification Details</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <X className="size-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 space-y-6">
                                {/* Project Badge */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Project</p>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-sm font-bold px-3 py-1 rounded text-white ${selectedNotification.projectColor}`}
                                        >
                                            {selectedNotification.project}
                                        </span>
                                        {selectedNotification.issueNumber > 0 && (
                                            <span className="text-sm font-semibold text-gray-900">
                                                #{selectedNotification.issueNumber}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">From</p>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full ${selectedNotification.user.initials === "JC"
                                                ? "bg-orange-500"
                                                : selectedNotification.user.initials === "WS"
                                                    ? "bg-purple-600"
                                                    : selectedNotification.user.initials === "AR"
                                                        ? "bg-gray-600"
                                                        : "bg-red-600"
                                                } flex items-center justify-center text-white font-bold`}
                                        >
                                            {selectedNotification.user.initials}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedNotification.user.name}</p>
                                            <p className="text-sm text-gray-600">{selectedNotification.user.name.toLowerCase()}@example.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Activity</p>
                                    <p className="text-gray-900 font-medium text-lg">
                                        {selectedNotification.action === "changed the status to In..."
                                            ? "Changed the status to In Progress"
                                            : selectedNotification.action === "changed timeline to..."
                                                ? "Changed timeline to next month"
                                                : selectedNotification.action === "replied"
                                                    ? "Replied to your comment"
                                                    : selectedNotification.action}
                                    </p>
                                </div>

                                {/* Timestamp */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Time</p>
                                    <p className="text-gray-900">{selectedNotification.timestamp}</p>
                                </div>

                                {/* Type Badge */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Type</p>
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        {selectedNotification.type === "status_change"
                                            ? "Status Change"
                                            : selectedNotification.type === "comment"
                                                ? "Comment"
                                                : "Assignment"}
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Status</p>
                                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${selectedNotification.isRead
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-blue-100 text-blue-800"
                                        }`}>
                                        {selectedNotification.isRead ? "Read" : "Unread"}
                                    </span>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                                {!selectedNotification.isRead && (
                                    <Button
                                        onClick={() => {
                                            handleMarkAsRead(selectedNotification.id);
                                            closeModal();
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Check className="size-4 mr-2" />
                                        Mark as Read
                                    </Button>
                                )}
                                <Button variant="outline" onClick={closeModal}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
