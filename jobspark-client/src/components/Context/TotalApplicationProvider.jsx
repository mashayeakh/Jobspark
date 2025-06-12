import React, { createContext, useState } from 'react'
import { getMethod, postMethod } from '../Utils/Api';

export const TotalApplicationContext = createContext();

const TotalApplicationProvider = ({ children }) => {


    //info who applied
    const [showAppliedInfo, setShowAppliedInfo] = useState();
    const appliedInfo = async (url) => {
        const response = await getMethod(url);
        setShowAppliedInfo(response);
        return response;
    }


    // information about applicants
    const [showAllApplicantsInfo, setShowAllApplicantsInfo] = useState();
    const allApplicantsInfo = async (url) => {
        const response = await getMethod(url);
        setShowAllApplicantsInfo(response);
        return response;
    }

    //num of today's new applications
    const [newAppli, setNewAppli] = useState(null);
    const newApplicantsToday = async (url) => {
        const response = await getMethod(url);
        setNewAppli(response);
        return response;
    }

    //operation of shortlisting/rejecting
    const [action, setAction] = useState({});
    const recruiterAction = async (url, data) => {
        const response = await postMethod(url, data);
        setAction(response);
        return response;
    }

    //show list of shortlisted applicants
    const [showShortlisted, setShowShortlisted] = useState({});
    const getShortlistedApplicants = async (url) => {
        const response = await getMethod(url);
        setShowShortlisted(response);
        return response;
    }




    const addInfo = {
        appliedInfo,
        allApplicantsInfo,
        newApplicantsToday,
        recruiterAction,
        getShortlistedApplicants,

        showAppliedInfo,
        setShowAppliedInfo,
        showAllApplicantsInfo,
        setShowAllApplicantsInfo,
        newAppli,
        setNewAppli,
        action,
        setAction,
        showShortlisted,
        setShowShortlisted
    }

    return (
        <TotalApplicationContext.Provider value={addInfo}>
            {children}
        </TotalApplicationContext.Provider>
    )
}

export default TotalApplicationProvider