import React, { createContext, useEffect, useState } from 'react'
import { getMethod } from '../../Utils/Api';


export const JobSeekerExportDataContext = createContext();

const JobSeekerExportDataContextProvider = ({ children }) => {

    //active profile
    const [activeProfile, setActiveProfile] = useState([]);
    const activeJobSeekerProfile = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/activeProfiles`;
        const res = await getMethod(url);
        // console.log("Calling from Data Context ", res);
        setActiveProfile(res);
        return res;
    }

    //all loc
    const [allLoc, setAllLoc] = useState([]);
    const allLocSeekerProfile = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/allLoc`;
        const res = await getMethod(url);
        // console.log("Calling from Data Context ", res);
        setAllLoc(res);
        return res;
    }

    //aplication info taken from csv
    const [applicationCsv, setApplicationCsv] = useState([]);
    const applicationCsvInfo = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/appliInfo`;
        const res = await getMethod(url);
        console.log("Calling from Data Context ", res);
        setApplicationCsv(res);
        return res;
    }



    useEffect(() => {
        activeJobSeekerProfile();
        allLocSeekerProfile();
        applicationCsvInfo();
    }, [])

    const addInfo = {
        activeJobSeekerProfile,
        allLocSeekerProfile,
        applicationCsvInfo,

        activeProfile,
        setActiveProfile,
        allLoc,
        setAllLoc,
        applicationCsv,
        setApplicationCsv
    }


    return (
        <JobSeekerExportDataContext.Provider value={addInfo}>
            {children}
        </JobSeekerExportDataContext.Provider>
    )
}

export default JobSeekerExportDataContextProvider