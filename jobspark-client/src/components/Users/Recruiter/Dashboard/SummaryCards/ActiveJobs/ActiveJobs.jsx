import React, { useContext, useEffect, useState } from 'react'
import { BsCheckLg, BsThreeDotsVertical } from 'react-icons/bs'
import { CiAlignLeft, CiLight, CiStar } from 'react-icons/ci'
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaCode } from 'react-icons/fa';
import { MdOutlinePeople } from 'react-icons/md';
import { RiBriefcase4Line } from 'react-icons/ri';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import ActiveJobs_FullTime from './ActiveJobs_FullTime';
import ActiveJobsTable from './ActiveJobsTable';
import { ActiveJobsContext } from '../../../../../Context/ActiveJobsContextProvider';
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import { BarChart } from '@mui/x-charts'

const ActiveJobs = () => {

    const { user } = useContext(AuthContext);

    const { getMostPopularJobByARecruiter, jobWithNoApplicationByARecruiter, fetchRecruiterAllActiveJobs, recentlyPublishedJobByARecruiter, closingSoonJobByARecruiter } = useContext(ActiveJobsContext);

    //* 1.most popular job by recruiter
    const [showPopularJob, setShowPopularJob] = useState({})
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


    const [daysLeft, setDaysLeft] = useState(null);
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
    //?-----------------------------------------------------------------------------------

    //* 2. job with no applications
    const [jobWithNoAppli, setJobWithNoAppli] = useState({})
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

    //all jobs
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
    //?-----------------------------------------------------------------------------------



    //* 3 recent most published jobs
    const [recentJobs, setRecentJobs] = useState({})
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

    //?-------------------------------------------------------------------------------------------



    //* 4. closing job
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

    //?------------------------------------------------------------------------------------------------------

    // * 1. most popular job
    console.log("Poput job length", showPopularJob);
    console.log("Applicatoin Count", showPopularJob.data?.applicantsCount);
    console.log("Job Title", showPopularJob.data?.jobTitle);


    //* 2. job with no applicants. 
    console.log("job With No Appli", jobWithNoAppli);
    console.log("job With No Appli Count ", jobWithNoAppli.data?.count);
    console.log("job With No Appli Count ", jobWithNoAppli.data?.count);

    const jobTitlesWithNoApplicants = Array.isArray(jobWithNoAppli.data?.jobsWithNoApplicans)
        ? jobWithNoAppli.data.jobsWithNoApplicans.map(job => job.jobTitle)
        : [];

    console.log("Job Titles with No Applicants:", jobTitlesWithNoApplicants);

    //* 3. recent published jobs
    console.log("Recent published jobs ", recentJobs);
    console.log("Recent published jobs length", recentJobs.data?.recentlyPublishedJobs?.length);

    const result = Array.isArray(recentJobs.data?.recentlyPublishedJobs) ? recentJobs.data.recentlyPublishedJobs.map(job => job.jobTitle) : []

    console.log("Recent published jobs length", recentJobs.data?.recentlyPublishedJobs?.length);
    console.log("Result ", result);
    console.log("Result length", result.length);


    //* 4. closing soon
    console.log("Clossing Soon ", closingVal);
    console.log("Clossing Soon length", closingVal.data?.count);

    const closingSoonTitle = Array.isArray(closingVal.data?.closingInfo) ? closingVal.data.closingInfo.map(job => job.jobTitle) : []
    console.log("Clossing Soon job Titles", closingSoonTitle);

    //? Data coming from active job table to render barchart ---------------------------------------------------------------
    const [receivedJobs, setReceivedJobs] = useState([]);
    const handleReceivedJobs = (jobs) => {
        console.log("Jobs received from ActiveJobsTable:", jobs);
        setReceivedJobs(jobs);
    };
    console.log("Coming from table ", receivedJobs);
    const re = receivedJobs.map(re => re.employeeType)
    console.log("Re ", re);

    const applicansTypeCounts = {
        'Full time': 0,
        'Part time': 0,
        'Internship': 0,
    }

    receivedJobs.forEach(job => {
        if (applicansTypeCounts[job.employeeType] !== undefined) {
            applicansTypeCounts[job.employeeType]++;
        }
    }
    )


    const applicantsTypeLabels = ['Full Time', 'Part Time', 'Internship'];

    const applicansTypeData = [
        applicansTypeCounts['Full Time'],
        applicansTypeCounts['Part Time'],
        applicansTypeCounts['Internship']
    ];

    return (
        < >
            <div className="bg-[#f5efff] w-full overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* card section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                        <div className="bg-white rounded-4xl w-full">
                            <div className=" card-lg ">
                                <div className="card-body">
                                    <h2 className="card-title">Most Popular Jobs</h2>
                                    <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                UX/UI Designer<br />
                                                {showPopularJob.data?.applicantsCount} Applicants •   {daysLeft > 0
                                                    ? `Deadline in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
                                                    : daysLeft === 0
                                                        ? "Deadline is today"
                                                        : "Deadline has passed"}
                                            </p>
                                        </div>

                                        {/* Chart */}
                                        <div className="flex-shrink-0 mt-4 md:mt-0">
                                            <Gauge width={100} height={100} value={progress} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-4xl w-full">
                            <div className=" card-lg ">
                                <div className="card-body">
                                    <h2 className="card-title">Jobs with No Applicants</h2>
                                    <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                {jobWithNoAppli.data?.count} applications with no jobs
                                            </p>
                                        </div>

                                        <div className="flex-shrink-0 mt-4 md:mt-0">
                                            <Gauge width={100} height={100} value={percentageNoApplicaition} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-4xl w-full">
                            <div className=" card-lg ">
                                <div className="card-body">
                                    <h2 className="card-title">Recently Published Jobs</h2>
                                    <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                <ul>
                                                    {Array.isArray(recentJobs.data?.recentlyPublishedJobs) &&
                                                        recentJobs.data.recentlyPublishedJobs.map((job, idx) => (
                                                            <li key={job._id}>
                                                                <strong>{job.jobTitle}</strong> {recentJobsWithTimeAgo[idx]}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </p>
                                        </div>
                                        {/* Chart */}
                                        <div className="flex-shrink-0 mt-4 md:mt-0">
                                            <Gauge width={100} height={100} value={averageFreshness} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-4xl w-full">
                            <div className=" card-lg ">
                                <div className="card-body">
                                    <h2 className="card-title">Jobs Closing Soon</h2>
                                    <div className="flex justify-between items-center w-full flex-wrap md:flex-nowrap">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">
                                                <ul>
                                                    {Array.isArray(closingInfoObj) &&
                                                        closingInfoObj.map((job, idx) => (
                                                            <li key={job._id}>
                                                                <strong>{job.jobTitle}</strong> — {daysAndHoursLeft[idx]}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </p>
                                        </div>

                                        {/* Chart */}
                                        <div className="flex-shrink-0 mt-4 md:mt-0">
                                            <Gauge width={100} height={100} value={percentageClosingSoon} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Bar Chart   */}

                    <div className="w-full flex items-center overflow-x-auto py-5">
                        <div className=" bg-white rounded-4xl shadow-lg p-6">
                            <BarChart
                                xAxis={[
                                    {
                                        scaleType: 'band',
                                        data: applicantsTypeLabels,
                                        categoryGapRatio: 0.3,
                                        barGapRatio: 0.2,
                                        label: 'Employee Type',
                                    },
                                ]}
                                yAxis={[
                                    {
                                        label: 'Job Count',
                                    },
                                ]}
                                series={[
                                    {
                                        data: applicansTypeData,
                                        label: 'Number of jobs',
                                        color: '#6366f1', // Indigo-500
                                    },
                                    {
                                        data: [1, 6, 3],
                                        label: 'Part-Time',
                                        color: '#10b981', // Emerald-500
                                    },
                                ]}
                                height={320}
                                width={500}
                                legend={{
                                    direction: 'row',
                                    position: {
                                        vertical: 'top',
                                        horizontal: 'middle',
                                    },
                                }}
                                margin={{ top: 40, bottom: 50, right: 20 }}
                                grid={{ horizontal: true }}
                            />
                        </div>
                    </div>
                    <ActiveJobsTable sendJobsToParent={handleReceivedJobs} />
                </div>
            </div>
        </>
    )
}

export default ActiveJobs