import React, { createContext, useEffect, useState } from 'react'
import { getMethod } from '../../Utils/Api';

export const JobSeekerActivityContext = createContext();

const JobSeekerActivityContextProvider = ({ children }) => {



    //jobSeeker Activity
    const [jActivity, setJActivity] = useState([]);
    const jobSeekerAcitivity = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/activity`;

        const res = await getMethod(url);
        // console.log("REs from activityu ", res);
        setJActivity(res);
        return res;
    }

    //inActive Activity
    const [jInActive, setJInActive] = useState([]);
    const jobSeekerInAcitivit = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/inactivity`;

        const res = await getMethod(url);
        setJInActive(res);
        return res;
    }

    //daily Activity
    const [daily, setDaily] = useState([]);
    const jobSeekerDailyActivity = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/daily`;

        const res = await getMethod(url);
        // console.log("REs from Dailllllyyyyyy ", res?.data);
        setDaily(res);
        return res;
    }

    //skills
    const [skills, setSkills] = useState([]);
    const jobSeekerTopSkills = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/top-skills`;

        const res = await getMethod(url);
        // console.log("REs from top skills ", res?.data);
        setSkills(res);
        return res;
    }

    //Experience Level
    const [exp, setExp] = useState([]);
    const jobSeekerExpLevel = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/experience-level`;

        const res = await getMethod(url);
        // console.log("REs from exp level ", res?.data);
        setExp(res);
        return res;
    }

    //Location wise users
    const [usersLoc, setUsersLoc] = useState([]);
    const jobSeekerLocs = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/locations`;

        const res = await getMethod(url);
        console.log("REs from locations ", res?.data);
        setUsersLoc(res);
        return res;
    }

    //popular job categories
    const [popularJobCat, setPopularJobCat] = useState([]);
    const jobSeekerPopularJobCategories = async () => {
        const url = `http://localhost:5000/api/v1/admin/jobseeker/popular-job-categories`;

        const res = await getMethod(url);
        console.log("REs from locations ", res?.data);
        setPopularJobCat(res);
        return res;
    }

    useEffect(() => {
        jobSeekerAcitivity();
        jobSeekerInAcitivit();
        jobSeekerDailyActivity();
        jobSeekerTopSkills();
        jobSeekerExpLevel();
        jobSeekerLocs();
        jobSeekerPopularJobCategories();
    }, [])


    const addInfo = {
        jobSeekerAcitivity,
        jobSeekerInAcitivit,
        jobSeekerDailyActivity,
        jobSeekerTopSkills,
        jobSeekerExpLevel,
        jobSeekerLocs,
        jobSeekerPopularJobCategories,

        jActivity,
        setJActivity,
        jInActive,
        setJInActive,
        daily,
        setDaily,
        skills,
        setSkills,
        exp,
        setExp,
        usersLoc,
        setUsersLoc,
        popularJobCat,
        setPopularJobCat
    }

    return (
        <JobSeekerActivityContext.Provider value={addInfo}>
            {children}
        </JobSeekerActivityContext.Provider>
    )
}

export default JobSeekerActivityContextProvider