import React, { createContext, useContext, useState } from 'react'
import Company from './../Company/Company';
import { getMethod, postMethod } from '../Utils/Api';
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
        if (response?.success === true) {
            await fetchingNotification();  // 🔁 fetch updated notifications
        }
        return response;
    };

    //get all companies
    const [allCompany, setAllCompany] = useState([]);
    const getCompany = async (url) => {
        const response = await getMethod(url);
        if (!response.success) throw new Error("Failed to fetch companies");
        setAllCompany(response);
        return response.data;
    }

    // //get a specific company information
    // const [companyDetails, setCompanyDetails] = useState([]);
    // const singleCompanyInfo = async (url) => {
    //     const response = await getMethod(url);
    //     setCompanyDetails(response);
    //     return response;
    // }

    const info = {
        createCompany,
        getCompany,
        // singleCompanyInfo,

        company,
        setCompany,
        allCompany,
        setAllCompany,
        // companyDetails,
        // setCompanyDetails
    }


    return (
        <CompanyContext.Provider value={info}>
            {children}
        </CompanyContext.Provider>
    )
}

export default CompanyContextProvider