import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContextProvider';
import { getMethod } from '../Utils/Api';


export const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {


    const { user } = useContext(AuthContext);


    const role = user?.role;
    const id = user?._id;

    // fetching notifications based on role and id
    const [notification, setNotification] = useState([]);

    const fetchingNotification = async () => {
        if (!role || !id) return;

        const url = role === "recruiter"
            ? `http://localhost:5000/api/v1/recruiter/${id}/all-notifications`
            : `http://localhost:5000/api/v1/jobseeker/${id}/all-notifications`;

        try {
            const response = await getMethod(url);
            setNotification(response); // <-- response is already the array!
            console.log("Response from fetchingNotification: ", response);
        } catch (error) {
            console.error("Error fetching notifications:", error.message);
        }
    };


    useEffect(() => {
        if (user) {
            fetchingNotification();
        }
    }, [user])


    const addInfo = {
        fetchingNotification,

        notification,
        setNotification

    }


    return (
        <NotificationContext.Provider value={addInfo}>
            {children}
        </NotificationContext.Provider>
    )


}
export default NotificationContextProvider