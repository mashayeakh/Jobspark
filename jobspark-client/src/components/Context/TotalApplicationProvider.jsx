import React, { createContext, useState } from 'react'
import { getMethod } from '../Utils/Api';

export const TotalApplicationContext = createContext();

const TotalApplicationProvider = ({ children }) => {

    const [showAppliedInfo, setShowAppliedInfo] = useState();
    const [showAllApplicantsInfo, setShowAllApplicantsInfo] = useState();


    const appliedInfo = async (url) => {
        const response = await getMethod(url);
        setShowAppliedInfo(response);
        return response;
    }


    const allApplicantsInfo = async (url) => {
        const response = await getMethod(url);
        setShowAllApplicantsInfo(response);
        return response;
    }



    const addInfo = {
        appliedInfo,
        allApplicantsInfo,
        showAppliedInfo,
        setShowAppliedInfo,
        showAllApplicantsInfo,
        setShowAllApplicantsInfo,
    }

    return (
        <TotalApplicationContext.Provider value={addInfo}>
            {children}
        </TotalApplicationContext.Provider>
    )
}

export default TotalApplicationProvider