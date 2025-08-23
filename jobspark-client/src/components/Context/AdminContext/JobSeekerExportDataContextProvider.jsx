import React, { createContext, useEffect, useState } from 'react'
import { getMethod } from '../../Utils/Api';


export const JobSeekerExportDataContext = createContext();

const JobSeekerExportDataContextProvider = ({ children }) => {


    const [activeProfile, setActiveProfile] = useState([]);
    const activeJobSeekerProfile = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/activeProfiles`;
        const res = await getMethod(url);
        console.log("Calling from Data Context ", res);
        setActiveProfile(res);
        return res;
    }

    useEffect(() => {
        activeJobSeekerProfile();
    }, [])

    const addInfo = {
        activeJobSeekerProfile,


        activeProfile,
        setActiveProfile,
    }


    return (
        <JobSeekerExportDataContext.Provider value={addInfo}>
            {children}
        </JobSeekerExportDataContext.Provider>
    )
}

export default JobSeekerExportDataContextProvider