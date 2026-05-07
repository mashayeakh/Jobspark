'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { getMethod, postMethod } from '@/lib/api';
import { AuthContext } from './AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const ActiveJobsContext = createContext();

const ActiveJobsContextProvider = ({ children }) => {
    const { user } = useContext(AuthContext);

    const [allActiveJobs, setAllActiveJobs] = useState([]);
    const [recruiterActiveJobs, setRecruiterActiveJobs] = useState([]);
    const [popularJob, setPopularJob] = useState({});
    const [jobWithNoApplicaiton, setJobWithNoApplicaiton] = useState({});
    const [recentjobs, setRecentjobs] = useState({});
    const [closingSoon, setClosingSoon] = useState({});
    const [savedJob, setSavedJob] = useState([]);
    const [savedNum, setSavedNum] = useState([]);
    const [filter, setFilter] = useState();
    const [hotJobs, setHotJobs] = useState([]);
    const [downloadJobs, setDownloadJobs] = useState([]);

    const fetchActiveJobsFromAPI = useCallback(async (url) => {
        const data = await getMethod(url);
        setAllActiveJobs(data);
        return data;
    }, []);

    const fetchRecruiterAllActiveJobs = useCallback(async (url) => {
        const data = await getMethod(url);
        setRecruiterActiveJobs(data);
        return data;
    }, []);

    const fetchAllActiveJobs = useCallback(async (url) => {
        const data = await getMethod(url);
        setAllActiveJobs(data);
        return data;
    }, []);

    const getMostPopularJobByARecruiter = async (url) => {
        const data = await getMethod(url);
        setPopularJob(data);
        return data;
    };

    const jobWithNoApplicationByARecruiter = async (url) => {
        const data = await getMethod(url);
        setJobWithNoApplicaiton(data);
        return data;
    };

    const recentlyPublishedJobByARecruiter = async (url) => {
        const data = await getMethod(url);
        setRecentjobs(data);
        return data;
    };

    const closingSoonJobByARecruiter = async (url) => {
        const data = await getMethod(url);
        setClosingSoon(data);
        return data;
    };

    const savingJobs = async (url, data) => {
        const res = await postMethod(url, data);
        setSavedJob(res);
        return res;
    };

    const fetchingSavedJobs = async (url) => {
        const res = await getMethod(url);
        setSavedNum(res);
        return res;
    };

    const filteredJobs = async (url) => {
        const res = await getMethod(url);
        setFilter(res);
        return res;
    };

    const fetchHotJobs = useCallback(async (url) => {
        const res = await getMethod(url);
        setHotJobs(res);
        return res;
    }, []);

    const downloadActiveJobs = async () => {
        const url = `${API}/api/v1/export/recruiter/${user?._id}/active-jobs`;
        const res = await getMethod(url);
        if (res) { setDownloadJobs(res); return res; }
    };

    const addInfo = {
        fetchActiveJobsFromAPI, fetchRecruiterAllActiveJobs, fetchAllActiveJobs,
        getMostPopularJobByARecruiter, jobWithNoApplicationByARecruiter,
        recentlyPublishedJobByARecruiter, closingSoonJobByARecruiter,
        savingJobs, fetchingSavedJobs, filteredJobs, fetchHotJobs, downloadActiveJobs,
        allActiveJobs, setAllActiveJobs, recruiterActiveJobs, setRecruiterActiveJobs,
        popularJob, setPopularJob, jobWithNoApplicaiton, setJobWithNoApplicaiton,
        recentjobs, setRecentjobs, closingSoon, setClosingSoon,
        savedJob, setSavedJob, savedNum, setSavedNum,
        filter, setFilter, hotJobs, setHotJobs, downloadJobs, setDownloadJobs,
    };

    return (
        <ActiveJobsContext.Provider value={addInfo}>
            {children}
        </ActiveJobsContext.Provider>
    );
};

export default ActiveJobsContextProvider;
