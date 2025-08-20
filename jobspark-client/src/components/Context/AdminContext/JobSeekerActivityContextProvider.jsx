import React, { createContext, useEffect, useState } from 'react'
import { getMethod } from '../../Utils/Api';

export const JobSeekerActivityContext = createContext();

const JobSeekerActivityContextProvider = ({ children }) => {



    //jobSeeker Activity
    const [jActivity, setJActivity] = useState([]);
    const jobSeekerAcitivity = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/activity`;

        const res = await getMethod(url);
        console.log("REs from activityu ", res);
        setJActivity(res);
        return res;
    }



    useEffect(() => {
        jobSeekerAcitivity();
    }, [])


    const addInfo = {
        jobSeekerAcitivity,

        jActivity,
        setJActivity
    }

    return (
        <JobSeekerActivityContext.Provider value={addInfo}>
            {children}
        </JobSeekerActivityContext.Provider>
    )
}

export default JobSeekerActivityContextProvider