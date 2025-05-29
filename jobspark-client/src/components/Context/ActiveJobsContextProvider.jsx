import React, { createContext, useState } from 'react'
import { getMethod, postMethod } from '../Utils/Api';

export const ActiveJobsContext = createContext();

const ActiveJobsContextProvider = ({ children }) => {

    const [allActiveJobs, setAllActiveJobs] = useState({});
    const [recruiterActiveJobs, setRecruiterActiveJobs] = useState({});

    // const fetchedActiveJobs = async (url) => {
    //     // const url = "http://localhost:5000/api/v1/job";
    //     const data = await getMethod(url);
    //     setAllActiveJobs(data);
    //     return data;
    // }


    const fetchRecruiterActiveJobs = async (url) => {
        const data = await getMethod(url);
        setRecruiterActiveJobs(data);
        return data;
    }




    const addInfo = {
        // fetchedActiveJobs,
        fetchRecruiterActiveJobs,
        allActiveJobs,
        setAllActiveJobs,
        recruiterActiveJobs,
        setRecruiterActiveJobs
    }


    return (
        <ActiveJobsContext.Provider value={addInfo}>
            {children}
        </ActiveJobsContext.Provider>
    )
}

export default ActiveJobsContextProvider