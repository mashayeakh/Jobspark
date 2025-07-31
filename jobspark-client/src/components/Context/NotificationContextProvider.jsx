import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContextProvider';
import { getMethod, postMethod } from '../Utils/Api';
import Notification from './../Pages/Notification/Notification';


export const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {


    const { user } = useContext(AuthContext);



    const role = user?.role;
    const id = user?._id;
    console.log("id ", id);

    console.log("role - ", user?.role);

    const res = role === "recruiter"
        ? "http://localhost:5000/api/v1/recruiter"
        : role === "job_seeker"
            ? "http://localhost:5000/api/v1/jobSeeker"
            : "";

    // fetching notifications based on role and id
    const [notification, setNotification] = useState([]);
    const fetchingNotification = async () => {
        if (!role || !id) return;

        // const url = role === "recruiter"
        //     ? `http://localhost:5000/api/v1/recruiter/${id}/all-notifications`
        //     : `http://localhost:5000/api/v1/jobseeker/${id}/all-notifications`;

        const url = `${res}/${id}/all-notifications`
        console.log("URL HITTING TO = ", url);

        try {
            const response = await getMethod(url);
            setNotification(response); // <-- response is already the array!
            console.log("Response from fetchingNotification:::: ", response);
        } catch (error) {
            console.error("Error fetching notifications:", error.message);
        }
    };


    //read the notification
    const markNotificationsRead = async () => {
        if (!role || !id) return;
        const url = `${res}/${id}/mark-read`;
        try {
            await postMethod(url, {});
            fetchingNotification();
        } catch (error) {
            console.error("Error marking notifications as read:", error.message);
        }
    }

    //fetch notification details based on recruiterid and applicant id
    const [notificationDetails, setNotificationDetails] = useState([]);
    const fetchNotificationDetails = async (url) => {
        const response = await getMethod(url);
        setNotificationDetails(response);
        return response;
    }




    const hasIncompleteProfileReminder = notification?.some(
        n => n.type === "reminder" && n.message?.toLowerCase().includes("complete your profile") && !n.isRead
    );




    //  Add this inside your NotificationContextProvider component
    // const [newNotification, setNewNotification] = useState([]);
    // const fetchAllJobSeekerNotifications = async (jobSeekerId) => {
    //     try {
    //         const url = `http://localhost:5000/api/v1/jobseeker/notification/${jobSeekerId}`
    //         console.log("UR ", url);
    //         const response = await getMethod(url);

    //         setNewNotification(response); // stores both admin + system notifications
    //     } catch (error) {
    //         console.error("Failed to fetch all job seeker notifications:", error);
    //     }
    // };






    useEffect(() => {
        if (user) {
            fetchingNotification();
            markNotificationsRead();
            fetchNotificationDetails();
            // fetchAllJobSeekerNotifications();
        }
    }, [user])





    // const addInfo = {
    //     fetchingNotification,
    //     markNotificationsRead,
    //     fetchNotificationDetails,

    //     notification,
    //     setNotification,

    //     notificationDetails,
    //     setNotificationDetails,

    // }


    const addInfo = {
        fetchingNotification,
        markNotificationsRead,
        fetchNotificationDetails,

        notification,
        setNotification,

        notificationDetails,
        setNotificationDetails,
        // fetchAllJobSeekerNotifications,
        hasIncompleteProfileReminder, // ✅ <-- ADD THIS
        // newNotification,
        // setNewNotification
    };

    return (
        <NotificationContext.Provider value={addInfo}>
            {children}
        </NotificationContext.Provider>
    )


}
export default NotificationContextProvider