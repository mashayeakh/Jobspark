import React, { createContext, useContext, useEffect, useState } from 'react'
import { getMethod, postMethod } from '../Utils/Api';
import { NotificationContext } from './NotificationContextProvider';
import { AuthContext } from './AuthContextProvider';

export const TotalApplicationContext = createContext();

const TotalApplicationProvider = ({ children }) => {

    const { fetchingNotification } = useContext(NotificationContext);
    const { user } = useContext(AuthContext);

    //info who applied
    const [showAppliedInfo, setShowAppliedInfo] = useState();
    const appliedInfo = async (url) => {
        const response = await getMethod(url);
        setShowAppliedInfo(response);
        return response;
    }

    //all applicans info - same as info who applied
    const [applied, setApplied] = useState([]);
    const getAllApplicants = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applicants-info`;
        // http://localhost:5000/api/v1/recruiter/6839c86523d93cb0daa3de99/all-applicants-info
        const res = await getMethod(url);
        if (res.success === true) {
            setApplied(res);
            return res;
        }
    }

    const [activity, setActivity] = useState([]);
    const getAllActivity = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/numOfStatus`;
        const res = await getMethod(url);
        if (res.success === true) {
            const { shortlistedCount, rejectedCount } = res;
            setActivity({ shortlistedCount, rejectedCount });
        }
    }





    // console.log("Applied ", applied.count);
    // information about applicants for grid
    const [showAllApplicantsInfo, setShowAllApplicantsInfo] = useState();
    const allApplicantsInfo = async (url) => {
        const response = await getMethod(url);
        setShowAllApplicantsInfo(response);
        return response;
    }

    // information about applicants for grid
    const [showAllApplicantsTab, setShowAllApplicantsTab] = useState();
    const allApplicantsInfoTable = async (url) => {
        const response = await getMethod(url);
        setShowAllApplicantsTab(response);
        return response;
    }

    //num of today's new applications
    const [newAppli, setNewAppli] = useState(null);
    const newApplicantsToday = async (url) => {
        const response = await getMethod(url);
        setNewAppli(response);
        return response;
    }

    //operation of shortlisting/rejecting
    const [action, setAction] = useState({});
    const recruiterAction = async (url, data) => {
        const response = await postMethod(url, data);
        setAction(response);
        return response;
    }

    //show list of shortlisted applicants
    const [showShortlisted, setShowShortlisted] = useState({});
    const getShortlistedApplicants = async (url) => {
        const response = await getMethod(url);
        setShowShortlisted(response);
        return response;
    }

    //send email to shortlisted applicants about his schedule 
    const [schedule, setSchedule] = useState({});
    const sendSchedule = async (url, data) => {
        const response = await postMethod(url, data);
        await fetchingNotification();
        setSchedule(response);
        return response;
    }

    useEffect(() => {
        if (!user?._id) return;
        getAllApplicants();
        getAllActivity();
    }, [user?._id])



    const addInfo = {
        appliedInfo,
        allApplicantsInfo,
        newApplicantsToday,
        recruiterAction,
        getShortlistedApplicants,
        sendSchedule,
        fetchingNotification,
        allApplicantsInfoTable,
        getAllApplicants,
        getAllActivity,



        showAppliedInfo,
        setShowAppliedInfo,
        showAllApplicantsInfo,
        setShowAllApplicantsInfo,
        newAppli,
        setNewAppli,
        action,
        setAction,
        showShortlisted,
        setShowShortlisted,
        schedule,
        setSchedule,
        showAllApplicantsTab,
        setShowAllApplicantsTab,
        applied,
        setApplied,
        activity,
        setActivity
    }

    return (
        <TotalApplicationContext.Provider value={addInfo}>
            {children}
        </TotalApplicationContext.Provider>
    )
}

export default TotalApplicationProvider