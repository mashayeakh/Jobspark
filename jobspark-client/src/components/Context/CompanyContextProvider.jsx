import React, { createContext, useState } from 'react'
import Company from './../Company/Company';
import { postMethod } from '../Utils/Api';

export const CompanyContext = createContext();
const CompanyContextProvider = ({ children }) => {


    //create company information
    const [company, setCompany] = useState([]);
    const createCompany = async (url, data) => {
        const response = await postMethod(url, data);
        console.log("Response from createCompany context - :", response);
        setCompany(response);
        return response;
    }


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