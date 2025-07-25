import React, { createContext, use, useContext, useEffect, useState } from 'react'
import { getMethod } from '../../Utils/Api';
import { AuthContext } from '../AuthContextProvider';

export const AdminDashboardContext = createContext();

const AdminDashboardContextProvider = ({ children }) => {

    const { user } = useContext(AuthContext);

    const [stats, setStats] = useState([]);
    const dashboardStats = async () => {
        const url = `http://localhost:5000/api/v1/admin/dashboard/stats`;
        const res = await getMethod(url)
        console.log("RES ", res);
        if (res.success === true) {
            setStats(res);
            return res
        } else {
            console.log("err in fetching stats", res.success);
        }
    }

    const [jobSeeker, setJobSeeker] = useState([]);
    const jobSeekerInfo = async () => {
        const url = `http://localhost:5000/api/v1/admin/dashboard/job-seekers/quick-stats`;
        const res = await getMethod(url);
        if (res.success === true) {
            setJobSeeker(res);
            return res
        } else {
            console.log("err in fetching job seeker info", res.success);
        }
    }

    const [recruiter, setRecruiter] = useState([]);
    const recruiterInfo = async () => {
        const url = `http://localhost:5000/api/v1/admin/dashboard/recruiter/quick-stats`;
        const res = await getMethod(url);
        if (res.success === true) {
            setRecruiter(res);
            return res
        } else {
            console.log("err in fetching recruiter info", res.success);
        }
    }


    const [pie, setPie] = useState([]);
    const pieInfo = async () => {
        const url = `http://localhost:5000/api/v1/admin/dashboard/skills-count`;
        const res = await getMethod(url);
        if (res.success === true) {
            setPie(res);
            return res
        } else {
            console.log("err in fetching recruiter info", res.success);
        }
    }


    // const [jobSeekerActivity, setJobSeekerActivity] = useState([]);
    // const jobSeeker = async () => {
    //     const url = 
    // }




    useEffect(() => {
        // if (!user?._id) return;
        dashboardStats();
        jobSeekerInfo();
        recruiterInfo();
        pieInfo();
    }, [user?._id])

    const addInfo = {
        dashboardStats,
        jobSeekerInfo,
        recruiterInfo,
        pieInfo,

        stats,
        setStats,
        jobSeeker,
        setJobSeeker,
        recruiter,
        setRecruiter,
        pie,
        setPie

    }


    return (
        <AdminDashboardContext.Provider value={addInfo}>
            {children}
        </AdminDashboardContext.Provider>
    )
}

export default AdminDashboardContextProvider