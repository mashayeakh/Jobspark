'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getMethod, postMethod } from '@/lib/api';

export const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const role = user?.role;
    const id = user?._id;

    const res = role === 'recruiter'
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/recruiter`
        : role === 'job_seeker'
            ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/jobSeeker`
            : '';

    const [notification, setNotification] = useState([]);

    const fetchingNotification = async () => {
        if (!role || !id) return;
        const url = `${res}/${id}/all-notifications`;
        try {
            const response = await getMethod(url);
            setNotification(response);
        } catch (error) {
            console.error('Error fetching notifications:', error.message);
        }
    };

    const markNotificationsRead = async () => {
        if (!role || !id) return;
        const url = `${res}/${id}/mark-read`;
        try {
            await postMethod(url, {});
            fetchingNotification();
        } catch (error) {
            console.error('Error marking notifications as read:', error.message);
        }
    };

    const [notificationDetails, setNotificationDetails] = useState([]);
    const fetchNotificationDetails = async (url) => {
        if (!url) return;
        const response = await getMethod(url);
        setNotificationDetails(response);
        return response;
    };

    const hasIncompleteProfileReminder = notification?.some(
        n => n.type === 'reminder' && n.message?.toLowerCase().includes('complete your profile') && !n.isRead
    );

    useEffect(() => {
        if (user) {
            fetchingNotification();
            markNotificationsRead();
        }
    }, [user]);

    const addInfo = {
        fetchingNotification,
        markNotificationsRead,
        fetchNotificationDetails,
        notification,
        setNotification,
        notificationDetails,
        setNotificationDetails,
        hasIncompleteProfileReminder,
    };

    return (
        <NotificationContext.Provider value={addInfo}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContextProvider;
