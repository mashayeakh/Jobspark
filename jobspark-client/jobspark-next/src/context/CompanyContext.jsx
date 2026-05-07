'use client';

import { createContext, useContext, useState } from 'react';
import { getMethod, postMethod } from '@/lib/api';
import { NotificationContext } from './NotificationContext';

export const CompanyContext = createContext();

const CompanyContextProvider = ({ children }) => {
    const { fetchingNotification } = useContext(NotificationContext);

    const [company, setCompany] = useState([]);
    const [allCompany, setAllCompany] = useState([]);
    const [companyDetails, setCompanyDetails] = useState([]);
    const [jobDetails, setJobDetails] = useState([]);
    const [companies, setCompanies] = useState([]);

    const createCompany = async (url, data) => {
        const response = await postMethod(url, data);
        setCompany(response);
        if (response?.success === true) await fetchingNotification();
        return response;
    };

    const getCompany = async (url) => {
        const response = await getMethod(url);
        if (!response.success) throw new Error('Failed to fetch companies');
        setAllCompany(response);
        return response.data;
    };

    const singleCompanyInfoWithJobs = async (url) => {
        const response = await getMethod(url);
        setCompanyDetails(response);
        return response;
    };

    const jobDetailsInfo = async (url) => {
        const response = await getMethod(url);
        setJobDetails(response);
        return response;
    };

    const allCompanies = async (url) => {
        const response = await getMethod(url);
        setCompanies(response);
        return response;
    };

    const info = {
        createCompany, getCompany, singleCompanyInfoWithJobs, jobDetailsInfo, allCompanies,
        company, setCompany, allCompany, setAllCompany,
        companyDetails, setCompanyDetails, jobDetails, setJobDetails,
        companies, setCompanies,
    };

    return <CompanyContext.Provider value={info}>{children}</CompanyContext.Provider>;
};

export default CompanyContextProvider;
