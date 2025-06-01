import React, { useContext, useEffect, useState } from 'react'
import { ActiveJobsContext } from '../../../../../../Context/ActiveJobsContextProvider';
import ActiveJobs from '../ActiveJobs';

const ParentActiveJob = ({ user }) => {


    const { getMostPopularJobByARecruiter, jobWithNoApplicationByARecruiter, fetchRecruiterAllActiveJobs, recentlyPublishedJobByARecruiter, closingSoonJobByARecruiter } = useContext(ActiveJobsContext);
    const [showPopularJob, setShowPopularJob] = useState({})
    const [daysLeft, setDaysLeft] = useState(null);
    const [jobWithNoAppli, setJobWithNoAppli] = useState({})
    const [recentJobs, setRecentJobs] = useState({})


    //** 1. Populat job */--------------------------------------------------------------
    const popularJob = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/popular-jobs`
        const data = await getMostPopularJobByARecruiter(url);
        if (data.status === true) {
            console.log("Data ", data);
            setShowPopularJob(data);
        } else {
            console.log("Error from popular jobs ", data);
        }

    }
    useEffect(() => {
        if (!user?._id) return;
        popularJob();
    }, [user?._id]);


    useEffect(() => {
        if (!showPopularJob?.data?.deadline) return;

        const deadLine = new Date(showPopularJob.data?.deadline);
        const today = new Date();

        // Remove time for full-day difference
        //h, min, sec, milie sec.
        deadLine.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = deadLine - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays);
    }, [showPopularJob]);

    const targetApplicants = 100;
    const currentApplicants = showPopularJob.data?.applicantsCount || 0;
    const progress = Math.min((currentApplicants / targetApplicants) * 100, 100);

    //?------------------------------------------------------------------------------------------------------
    //** 2. job with no applications*/-------------------------------------------

    const withoutJobApplication = async () => {

        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/no-jobs`
        const data = await jobWithNoApplicationByARecruiter(url);
        if (data.status === true) {
            setJobWithNoAppli(data);
            console.log("No Job", data);
        } else {
            console.log("Error from no jobs appli", data);
        }
    }

    console.log("No jobbbbbbb ", jobWithNoAppli);
    useEffect(() => {
        if (!user?._id) return;
        withoutJobApplication();
    }, [user?._id])



    //?all jobs
    const [allJobs, setAllJobs] = useState([])
    useEffect(() => {
        const allActiveJobs = async () => {
            const url = "http://localhost:5000/api/v1/job/recruiter"
            const response = await fetchRecruiterAllActiveJobs(url);
            if (response.status === true) {
                console.log("Response frop active job detials", response.data);
                setAllJobs(response);
            }
        }
        allActiveJobs()
    }, [])
    const jobLength = allJobs.data?.length;

    const percentageNoApplicaition = jobLength && jobLength > 0
        ? Math.floor(Math.min((jobWithNoAppli?.data?.count / jobLength) * 100, 100))
        : 0;
    // console.log("Percen", percentageNoApplicaition);

    //?----------------------------------------------------------------------------------------------------

    //** 3. recent most published jobs --------------------------------------------------------
    const recentlyPublishedJobs = async () => {

        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/recent-jobs`
        const data = await recentlyPublishedJobByARecruiter(url);
        if (data.status === true) {
            setRecentJobs(data);
            console.log("R = ", data);
        } else {
            console.log("Error from no jobs appli", data);
        }
    }

    console.log("Recent jobbbbbbb ", recentJobs);

    // If recentJobs.data is an array, map over it to get recentCreationTime values
    const recentCreationTimes = Array.isArray(recentJobs.data?.recentCreationTime)
        ? recentJobs.data.recentCreationTime
        : [];

    const readableTimes = recentCreationTimes.map(ts => {
        const data = new Date(ts);
        return data;
    })

    console.log("Readable time ", readableTimes);
    console.log("Readable time length ", readableTimes.length);

    const cd = new Date();
    console.log("CD ", cd);
    // Calculate the time ago (e.g., "4h 34m ago", "2d 3h ago") for each recent job's creation time
    function getTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffDay > 0) {
            const hours = diffHr % 24;
            return `${diffDay}d${hours > 0 ? ` ${hours}h` : ""} ago`;
        }
        if (diffHr > 0) {
            const mins = diffMin % 60;
            return `${diffHr}h${mins > 0 ? ` ${mins}m` : ""} ago`;
        }
        if (diffMin > 0) return `${diffMin}m ago`;
        return "Just now";
    }

    const recentJobsWithTimeAgo = readableTimes.map(date => getTimeAgo(date));
    console.log("Days ago for each recent job:", recentJobsWithTimeAgo);


    useEffect(() => {
        if (!user?._id) return;
        recentlyPublishedJobs();
    }, [user?._id])

    const MAX_DIFF_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

    const getFreshnessPercent = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const freshness = Math.max(0, 100 - Math.floor((diff / MAX_DIFF_MS) * 100));
        return freshness;
    };

    // Calculate average freshness
    const averageFreshness = Array.isArray(recentJobs.data?.recentlyPublishedJobs)
        ? recentJobs.data.recentlyPublishedJobs.reduce((acc, job) => {
            return acc + getFreshnessPercent(job.createdAt);
        }, 0) / recentJobs.data.recentlyPublishedJobs.length
        : 0;

    //?----------------------------------------------------------------------------------------

    //** 4. closing job ------------------------------------------------------------------
    const [closingVal, setClosingVal] = useState([]);
    const closingTime = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/closing-jobs`;
        const data = await closingSoonJobByARecruiter(url);
        if (data.status === true) {
            setClosingVal(data);
            console.log("DATA from closing time", data);
        }
    }

    useEffect(() => {
        if (!user?._id) return;
        closingTime();
    }, [user?._id])

    console.log("Value from closing val = ", closingVal);
    console.log("DATA from closing val = ", closingVal.data);

    const closingInfoObj = closingVal.data?.closingInfo
    console.log("object == ", closingInfoObj);

    const closingJobTitle = closingInfoObj?.map(j => j.jobTitle)
    console.log("closingJobTitle = ", closingJobTitle);

    const deadline = closingInfoObj?.map(j => j.deadline)
    console.log("Deadline = ", deadline); 1

    // Convert each deadline to a readable date string
    const readableDeadlines = Array.isArray(deadline)
        ? deadline.map(d => d ? new Date(d).toLocaleString() : "")
        : [];

    // Calculate days and hours left from now for each deadline
    const daysAndHoursLeft = Array.isArray(deadline)
        ? deadline.map(d => {
            if (!d) return "";
            const now = new Date();
            const end = new Date(d);
            const diffMs = end - now;
            if (diffMs <= 0) return "Deadline passed";
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            return `${diffDays}d ${diffHrs}h left`;
        })
        : [];

    console.log("Days and hours left for each deadline:", daysAndHoursLeft);

    const currDate = readableDeadlines;
    console.log("Cloing Date", currDate);
    const percentageClosingSoon = Math.round((closingInfoObj?.length / jobLength) * 100);





    return (
        <ActiveJobs

            user={user}    
            
            //* popular job
            showPopularJob={showPopularJob}
            daysLeft={daysLeft}
            progress={progress}

            //* job with no appli
            jobWithNoAppli={jobWithNoAppli}
            percentageNoApplication={percentageNoApplicaition}

            //*recently published jobs
            recentJobs={recentJobs}
            recentJobsWithTimeAgo={recentJobsWithTimeAgo}
            averageFreshness={averageFreshness}

            //* clossing soon jobs
            closingInfoObj={closingInfoObj}
            daysAndHoursLeft={daysAndHoursLeft}
            percentageClosingSoon={percentageClosingSoon}
        />
    )
}

export default ParentActiveJob