import React, { createContext, useState } from 'react'
import { getMethod } from '../Utils/Api';

export const TotalApplicationContext = createContext();

const TotalApplicationProvider = ({ children }) => {

    const [showAppliedInfo, setShowAppliedInfo] = useState();
    const [showAllApplicantsInfo, setShowAllApplicantsInfo] = useState();
    const [newAppli, setNewAppli] = useState(null);


    //info who applied
    const appliedInfo = async (url) => {
        const response = await getMethod(url);
        setShowAppliedInfo(response);
        return response;
    }


    // information about applicants
    const allApplicantsInfo = async (url) => {
        const response = await getMethod(url);
        setShowAllApplicantsInfo(response);
        return response;
    }

    //num of today's new applications
    const newApplicantsToday = async (url) => {
        const response = await getMethod(url);
        setNewAppli(response);
        return response;
    }

    //show the status like rejected and shortlisted
    // const [status, setStatus] = useState(null);
    // const showStatus = (url) => {
    //     const response = await 
    // }



    const addInfo = {
        appliedInfo,
        allApplicantsInfo,
        newApplicantsToday,
        showAppliedInfo,
        setShowAppliedInfo,
        showAllApplicantsInfo,
        setShowAllApplicantsInfo,
        newAppli,
        setNewAppli,
    }

    return (
        <TotalApplicationContext.Provider value={addInfo}>
            {children}
        </TotalApplicationContext.Provider>
    )
}

export default TotalApplicationProvider