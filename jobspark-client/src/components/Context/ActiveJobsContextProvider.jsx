import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getMethod, postMethod } from '../Utils/Api';
import { AuthContext } from './AuthContextProvider';

export const ActiveJobsContext = createContext();

const ActiveJobsContextProvider = ({ children }) => {

    const [allActiveJobs, setAllActiveJobs] = useState([]);
    const [recruiterActiveJobs, setRecruiterActiveJobs] = useState([]);
    const [popularJob, setPopularJob] = useState({})
    const [jobWithNoApplicaiton, setJobWithNoApplicaiton] = useState({})
    const [recentjobs, setRecentjobs] = useState({})
    const [closingSoon, setClosingSoon] = useState({})

    const { user } = useContext(AuthContext);
    console.log("USER ID ", user?._id);

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



    //saved jobs
    const [savedJob, setSavedJob] = useState([]);
    const savingJobs = async (url, data) => {
        const res = await postMethod(url, data);
        setSavedJob(res);
        return res;
    }


    //num of saved jobs
    const [savedNum, setSavedNum] = useState([]);
    const fetchingSavedJobs = async (url) => {
        const res = await getMethod(url);
        setSavedNum(savedNum);
        return res;
    }

    // //ai recommended jobs
    // const [aiRecommandation, setAiRecommandation] = useState([]);
    // const fetchingAiRecomJobs = async () => {
    //     const url = `http://localhost:5000/api/v1/ai/recommend-jobs/${user?._id}`;
    //     console.log("URL ", url);
    //     const response = await getMethod(url);
    //     if (response.success === "true") {
    //         setAiRecommandation(response);
    //     }
    // }

    // console.log("AI JOBSSS ===", aiRecommandation);

    const [filter, setFilter] = useState();
    const filteredJobs = async (url) => {
        const res = await getMethod(url);
        setFilter(res);
        return res;
    }

    // //hot Jobs
    // const [hotJobs, setHotJobs] = useState([]);
    // const fetchHotJobs = useCallback(async () => {
    //     const url = `http://localhost:5000/api/v1/hotJobs`;
    //     const res = await getMethod(url);
    //     if (res.success === true) {
    //         setHotJobs(res.data);
    //     }
    //     return res;
    // }, []); // <= very important: empty dependency array


    // useEffect(() => {
    //     if (!user?._id) return;
    //     fetchingAiRecomJobs();
    // }, [user?._id])



    const addInfo = {
        fetchActiveJobsFromAPI,
        fetchRecruiterAllActiveJobs,
        fetchAllActiveJobs,
        getMostPopularJobByARecruiter,
        jobWithNoApplicationByARecruiter,
        recentlyPublishedJobByARecruiter,
        closingSoonJobByARecruiter,
        // fetchHotJobs,
        savingJobs,
        fetchingSavedJobs,
        // fetchingAiRecomJobs,
        filteredJobs,

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
        savedJob,
        setSavedJob,
        savedNum,
        setSavedNum,
        // aiRecommandation,
        // setAiRecommandation,
        filter,
        setFilter
    }



    // const addInfo = useMemo(() => ({
    //     fetchActiveJobsFromAPI,
    //     fetchRecruiterAllActiveJobs,
    //     fetchAllActiveJobs,
    //     getMostPopularJobByARecruiter,
    //     jobWithNoApplicationByARecruiter,
    //     recentlyPublishedJobByARecruiter,
    //     closingSoonJobByARecruiter,
    //     // fetchHotJobs,

    //     allActiveJobs,
    //     setAllActiveJobs,
    //     recruiterActiveJobs,
    //     setRecruiterActiveJobs,
    //     popularJob,
    //     setPopularJob,
    //     jobWithNoApplicaiton,
    //     setJobWithNoApplicaiton,
    //     recentjobs,
    //     setRecentjobs,
    //     closingSoon,
    //     setClosingSoon,
    //     // hotJobs,
    //     // setHotJobs
    // }), [
    //     fetchActiveJobsFromAPI,
    //     fetchRecruiterAllActiveJobs,
    //     fetchAllActiveJobs,
    //     getMostPopularJobByARecruiter,
    //     jobWithNoApplicationByARecruiter,
    //     recentlyPublishedJobByARecruiter,
    //     closingSoonJobByARecruiter,
    //     // fetchHotJobs,
    //     allActiveJobs,
    //     recruiterActiveJobs,
    //     popularJob,
    //     jobWithNoApplicaiton,
    //     recentjobs,
    //     closingSoon,
    //     // hotJobs
    // ]);


    return (
        <ActiveJobsContext.Provider value={addInfo}>
            {children}
        </ActiveJobsContext.Provider>
    )
}

export default ActiveJobsContextProvider