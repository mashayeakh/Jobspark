import { createContext, useContext, useState } from 'react';
import { getMethod } from '../Utils/Api';
import { NotificationContext } from './NotificationContextProvider';
// import { InterviewContext } from './InterviewContext';


export const InterviewContext = createContext();


const InterviewContextProvider = ({ children }) => {






    //gett all the info about interview schedules
    const [showScheduleInfo, setShowScheduleInfo] = useState([]);
    const interviewScheduleInfo = async (url) => {
        const response = await getMethod(url);
        return response;
    }





    const info = {
        interviewScheduleInfo,

        showScheduleInfo,
        setShowScheduleInfo,
    }

    return (
        <InterviewContext.Provider value={info}>
            {children}
        </InterviewContext.Provider>
    )
}

export default InterviewContextProvider