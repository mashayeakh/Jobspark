import { createContext, useState } from 'react';
import { getMethod } from '../Utils/Api';
// import { InterviewContext } from './InterviewContext';


export const InterviewContext = createContext();


const InterviewContextProvider = ({ children }) => {


    const [showScheduleInfo, setShowScheduleInfo] = useState([]);

    const interviewScheduleInfo = async (url) => {
        const response = await getMethod(url);
        setShowScheduleInfo(response);
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