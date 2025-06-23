import React, { createContext, useContext, useState } from 'react'
import Company from './../Company/Company';
import { postMethod } from '../Utils/Api';
import { NotificationContext } from './NotificationContextProvider';

export const CompanyContext = createContext();
const CompanyContextProvider = ({ children }) => {

    const { fetchingNotification } = useContext(NotificationContext);


    //create company information
    const [company, setCompany] = useState([]);
    const createCompany = async (url, data) => {
        const response = await postMethod(url, data);
        console.log("Response from createCompany context - :", response);
        setCompany(response);
        
        // ✅ Trigger notification update
        if (response?.success === true) {
            await fetchingNotification();  // 🔁 fetch updated notifications
        }
        return response;
    };



    const info = {
        createCompany,

        company,
        setCompany,
    }


    return (
        <CompanyContext.Provider value={info}>
            {children}
        </CompanyContext.Provider>
    )
}

export default CompanyContextProvider