import React, { createContext, useCallback, useState } from 'react'
import { getMethod } from '../Utils/Api';

export const ActiveJobsContext = createContext();

const ActiveJobsContextProvider = ({ children }) => {

    const [allActiveJobs, setAllActiveJobs] = useState([]);
    const [recruiterActiveJobs, setRecruiterActiveJobs] = useState([]);
    const [popularJob, setPopularJob] = useState({})
    const [jobWithNoApplicaiton, setJobWithNoApplicaiton] = useState({})
    const [recentjobs, setRecentjobs] = useState({})
    const [closingSoon, setClosingSoon] = useState({})

    // only
    const fetchActiveJobsFromAPI = useCallback(async (url) => {
        const data = await getMethod(url);
        setAllActiveJobs(data);
        return data;
    }, []);


    // only shows the jobs belog to specific recruiter
    const fetchRecruiterAllActiveJobs = useCallback(async (url) => {
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



    const getMostPopularJobByARecruiter = async (url) => {
        const data = await getMethod(url);
        setPopularJob(data);
        return data;
    }

    const jobWithNoApplicationByARecruiter = async (url) => {
        const data = await getMethod(url);
        setJobWithNoApplicaiton(data);
        return data;
    }

    const recentlyPublishedJobByARecruiter = async (url) => {
        const data = await getMethod(url);
        setRecentjobs(data);
        return data;
    }

    //clsoing soon job by a specific recruiter
    const closingSoonJobByARecruiter = async (url) => {
        const data = await getMethod(url);
        setClosingSoon(data);
        return data;
    }


    




    const addInfo = {
        fetchActiveJobsFromAPI,
        fetchRecruiterAllActiveJobs,
        fetchAllActiveJobs,
        getMostPopularJobByARecruiter,
        jobWithNoApplicationByARecruiter,
        recentlyPublishedJobByARecruiter,
        closingSoonJobByARecruiter,
        allActiveJobs,
        setAllActiveJobs,
        recruiterActiveJobs,
        setRecruiterActiveJobs,
        popularJob,
        setPopularJob,
        jobWithNoApplicaiton,
        setJobWithNoApplicaiton,
        recentjobs,
        setRecentjobs,
        closingSoon,
        setClosingSoon,
    }


    return (
        <ActiveJobsContext.Provider value={addInfo}>
            {children}
        </ActiveJobsContext.Provider>
    )
}

export default ActiveJobsContextProvider