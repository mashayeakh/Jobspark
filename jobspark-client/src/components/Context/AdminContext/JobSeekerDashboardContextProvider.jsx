import React, { createContext, useEffect, useState } from 'react'
import { getMethod } from '../../Utils/Api';

export const JobSeekerDashboardContext = createContext();

const JobSeekerDashboardContextProvider = ({ children }) => {


    //total job seeker
    const [total_JobSeeker, setTotal_JobSeeker] = useState([]);
    const jobSeeker = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/total_job_seeker`;
            const response = await getMethod(url);
            if (response.success === true) {
                setTotal_JobSeeker(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error fetching job seeker data:", error);
        }
    }

    //active profiel
    const [active_profile, setActive_profile] = useState([]);
    const activeProfile = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/active_profile`;
            const response = await getMethod(url);
            if (response.success === true) {
                setActive_profile(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }

    //New Registration
    const [new_Registration, setNew_Registration] = useState([]);
    const newRegis = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/new_registration`;
            const response = await getMethod(url);
            if (response.success === true) {
                setNew_Registration(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }

    //profile_completion
    const [profile_completion, setProfile_completion] = useState([]);
    const profileCompletion = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/profile_completion`;
            const response = await getMethod(url);
            if (response.success === true) {
                setProfile_completion(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }

    //Skills distribution
    const [skills_distribution, setSkills_distribution] = useState([]);
    const skillsDistribution = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/skills_distribution`;
            const response = await getMethod(url);
            if (response.success === true) {
                setSkills_distribution(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }

    //top_skills
    const [top_skills, setTop_skills] = useState([]);
    const topSkills = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/top_skills`;
            const response = await getMethod(url);
            if (response.success === true) {
                setTop_skills(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }


    //top_loc
    const [top_loc, setTop_loc] = useState([]);
    const topLoc = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/top_location`;
            const response = await getMethod(url);
            if (response.success === true) {
                setTop_loc(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }

    //top_loc
    const [top_job_categories, setTop_job_categories] = useState([]);
    const topJobCategories = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/dashboard/top_job_categories`;
            const response = await getMethod(url);
            if (response.success === true) {
                setTop_job_categories(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }

    //qucik stats
    const [stats, setStats] = useState([]);
    const quickOverview = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/all/overview-stats`;
            const response = await getMethod(url);
            if (response.success === true) {
                setStats(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }

    //completeness
    const [completeness, setCompleteness] = useState([]);
    const completeProfile = async () => {
        try {
            const url = `http://localhost:5000/api/v1/admin/jobseeker/all/completeness`;
            const response = await getMethod(url);
            if (response.success === true) {
                setCompleteness(response);
                return response;
            } else {
                console.log("response ", response.success);
            }
        } catch (error) {
            console.error("Error ", error);
        }
    }



    useEffect(() => {
        jobSeeker();
        activeProfile();
        newRegis();
        profileCompletion();
        skillsDistribution();
        topSkills();
        topLoc();
        topJobCategories();
        quickOverview();
        completeProfile();
    }, [])

    const addInfo = {
        jobSeeker,
        activeProfile,
        newRegis,
        profileCompletion,
        skillsDistribution,
        topSkills,
        topLoc,
        topJobCategories,
        quickOverview,
        completeProfile,


        total_JobSeeker,
        setTotal_JobSeeker,
        active_profile,
        setActive_profile,
        new_Registration,
        setNew_Registration,
        profile_completion,
        setProfile_completion,
        skills_distribution,
        setSkills_distribution,
        top_skills,
        setTop_skills,
        top_loc,
        setTop_loc,
        top_job_categories,
        setTop_job_categories,
        stats,
        setStats,
        completeness,
        setCompleteness
    }


    return (
        <JobSeekerDashboardContext.Provider value={addInfo}>
            {children}
        </JobSeekerDashboardContext.Provider>
    )
}

export default JobSeekerDashboardContextProvider