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

    //get a specific company information with jobs
    const [companyDetails, setCompanyDetails] = useState([]);
    const singleCompanyInfoWithJobs = async (url) => {
        const response = await getMethod(url);
        setCompanyDetails(response);
        return response;
    }

    //get a sepecific job informations belonging to speficic company and receruiter
    const [jobDetails, setJobDetails] = useState([]);
    const jobDetailsInfo = async (url) => {
        const response = await getMethod(url);
        setJobDetails(response);
        return response;
    }





    const info = {
        createCompany,
        getCompany,
        singleCompanyInfoWithJobs,
        jobDetailsInfo,

        company,
        setCompany,
        allCompany,
        setAllCompany,
        companyDetails,
        setCompanyDetails,
        jobDetails,
        setJobDetails
    }


    return (
        <CompanyContext.Provider value={info}>
            {children}
        </CompanyContext.Provider>
    )
}

export default CompanyContextProvider