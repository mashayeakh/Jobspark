import React, { createContext, useCallback, useState } from 'react'
import { getMethod, postMethod } from '../Utils/Api';

export const ActiveJobsContext = createContext();

const ActiveJobsContextProvider = ({ children }) => {

    const [allActiveJobs, setAllActiveJobs] = useState([]);
    const [recruiterActiveJobs, setRecruiterActiveJobs] = useState([]);

    // only
    // const fetchActiveJobsFromAPI = useCallback(async (url) => {
    //     const data = await getMethod(url);
    //     setAllActiveJobs(data);
    //     return data;
    // }, []);


    // only shows the jobs belog to specific recruiter
    const fetchRecruiterActiveJobs = useCallback(async (url) => {
        const data = await getMethod(url);
        setRecruiterActiveJobs(data);
        return data;
    }, [])


    //shows all the active jobs togather. 
    const fetchAllActiveJobs = useCallback(async (url) => {
        const data = await getMethod(url);
        setAllActiveJobs(data);
        return data;
    }, [])














    const addInfo = {
        // fetchActiveJobsFromAPI,
        fetchRecruiterActiveJobs,
        fetchAllActiveJobs,
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