import React, { createContext, useEffect, useState } from 'react'
import { getMethod } from '../../Utils/Api';

export const JobSeekerVerifiedContext = createContext();

const JobSeekerVerifiedContextProvider = ({ children }) => {



    //get verified and unverified job seekers 
    const [verified, setVerified] = useState([]);

    const verifiedJobSeeker = async () => {
        const url = `http://localhost:5000/api/v1/admin/all/verified-jobseeker`;
        const response = await getMethod(url);
        if (response.success === true) {
            setVerified(response);
            console.log("Veifeid from context === ", response);
            return response;
        } else {
            console.log("Veifeid ", response.success);
        }
    }


    useEffect(() => {
        verifiedJobSeeker();
    }, [])


    const addInfo = {
        verifiedJobSeeker,

        verified,
        setVerified,

    }


    return (
        <JobSeekerVerifiedContext.Provider value={addInfo}>

            {children}

        </JobSeekerVerifiedContext.Provider>
    )
}

export default JobSeekerVerifiedContextProvider