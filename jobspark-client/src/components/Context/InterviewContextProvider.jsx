import { createContext, useState } from 'react';
import { getMethod } from '../Utils/Api';
// import { InterviewContext } from './InterviewContext';


export const InterviewContext = createContext();


const InterviewContextProvider = ({ children }) => {


    //gett all the info about interview schedules
    const [showScheduleInfo, setShowScheduleInfo] = useState([]);
    const interviewScheduleInfo = async (url) => {
        const response = await getMethod(url);
        setShowScheduleInfo(response);
        return response;
    }


    //add unred notifications 
    const [showNotification, setShowNotification] = useState([]);
    const [unread, setUnread] = useState(0);

    const addNotification = async (message) => {
        //there is not api there but to add all the previous and curr notifications
        setShowNotification(prev => {
            const updated = [...prev, { message, timestamp: new Date(), read: false }]
            setUnread(updated.filter(i => !i.read));

            return updated;
        })
    }



    const info = {
        interviewScheduleInfo,
        addNotification,

        showScheduleInfo,
        setShowScheduleInfo,
        showNotification,
        setShowNotification,
        unread,
        setUnread,
    }

    return (
        <InterviewContext.Provider value={info}>
            {children}
        </InterviewContext.Provider>
    )
}

export default InterviewContextProvider