import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContextProvider';
import { getMethod, postMethod } from '../Utils/Api';
import Notification from './../Pages/Notification/Notification';


export const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {


    const { user } = useContext(AuthContext);


    const role = user?.role;
    const id = user?._id;


    const res = role === "recruiter"
        ? "http://localhost:5000/api/v1/recruiter"
        : "http://localhost:5000/api/v1/jobseeker"

    // fetching notifications based on role and id
    const [notification, setNotification] = useState([]);
    const fetchingNotification = async () => {
        if (!role || !id) return;

        // const url = role === "recruiter"
        //     ? `http://localhost:5000/api/v1/recruiter/${id}/all-notifications`
        //     : `http://localhost:5000/api/v1/jobseeker/${id}/all-notifications`;

        const url = `${res}/${id}/all-notifications`

        try {
            const response = await getMethod(url);
            setNotification(response); // <-- response is already the array!
            console.log("Response from fetchingNotification: ", response);
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

    useEffect(() => {
        if (user) {
            fetchingNotification();
            markNotificationsRead();
            fetchNotificationDetails();
        }
    }, [user])





    const addInfo = {
        fetchingNotification,
        markNotificationsRead,
        fetchNotificationDetails,

        notification,
        setNotification,

        notificationDetails,
        setNotificationDetails,

    }


    return (
        <NotificationContext.Provider value={addInfo}>
            {children}
        </NotificationContext.Provider>
    )


}
export default NotificationContextProvider