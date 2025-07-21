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

    console.log("showPopularJob ", showPopularJob);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                        {/* Most Popular Jobs Card */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                            </svg>
                                            Most Popular Jobs
                                        </h2>
                                        <div className="mt-3">
                                            <p className="text-gray-600 text-sm mb-1">{showPopularJob?.data?.jobTitle}</p>
                                            <div className="flex items-center text-xs text-gray-500 space-x-2">
                                                <span>{showPopularJob?.data?.applicantsCount || 0} Applicants</span>
                                                <span>•</span>
                                                <span className={daysLeft <= 3 ? "text-red-500 font-medium" : "text-gray-500"}>
                                                    {daysLeft > 0
                                                        ? `Deadline in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
                                                        : daysLeft === 0
                                                            ? "Deadline today"
                                                            : "Deadline passed"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Gauge
                                            width={80}
                                            height={80}
                                            value={progress}
                                            color={progress > 70 ? "#10B981" : progress > 30 ? "#F59E0B" : "#EF4444"}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Popularity</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div
                                            className="bg-blue-500 h-1.5 rounded-full"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Jobs with No Applicants Card */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            No Applicants
                                        </h2>
                                        <div className="mt-3">
                                            <p className="text-gray-600 text-sm">
                                                {jobWithNoAppli.data?.count || 0} jobs with no applicants
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Gauge
                                            width={80}
                                            height={80}
                                            value={percentageNoApplicaition}
                                            color={percentageNoApplicaition > 50 ? "#EF4444" : "#F59E0B"}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Attention needed</span>
                                        <span>{percentageNoApplicaition}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div
                                            className="bg-amber-500 h-1.5 rounded-full"
                                            style={{ width: `${percentageNoApplicaition}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recently Published Jobs Card */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                            </svg>
                                            Recent Jobs
                                        </h2>
                                        <ul className="mt-3 space-y-2">
                                            {Array.isArray(recentJobs.data?.recentlyPublishedJobs) &&
                                                recentJobs.data.recentlyPublishedJobs.slice(0, 2).map((job, idx) => (
                                                    <li key={job._id} className="text-sm">
                                                        <p className="font-medium text-gray-700 truncate">{job.jobTitle}</p>
                                                        <p className="text-xs text-gray-500">{recentJobsWithTimeAgo[idx]}</p>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Gauge
                                            width={80}
                                            height={80}
                                            value={averageFreshness}
                                            color={averageFreshness > 70 ? "#10B981" : "#F59E0B"}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Freshness</span>
                                        <span>{averageFreshness}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div
                                            className="bg-green-500 h-1.5 rounded-full"
                                            style={{ width: `${averageFreshness}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Jobs Closing Soon Card */}
                        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
                            <div className="p-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            Closing Soon
                                        </h2>
                                        <ul className="mt-3 space-y-2">
                                            {Array.isArray(closingInfoObj) &&
                                                closingInfoObj.slice(0, 2).map((job, idx) => (
                                                    <li key={job._id} className="text-sm">
                                                        <p className="font-medium text-gray-700 truncate">{job.jobTitle}</p>
                                                        <p className="text-xs text-gray-500">{daysAndHoursLeft[idx]}</p>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Gauge
                                            width={80}
                                            height={80}
                                            value={percentageClosingSoon}
                                            color={percentageClosingSoon > 70 ? "#EF4444" : "#F59E0B"}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Urgency</span>
                                        <span>{percentageClosingSoon}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                        <div
                                            className="bg-purple-500 h-1.5 rounded-full"
                                            style={{ width: `${percentageClosingSoon}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Bar Chart   */}

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 hover:shadow-md transition-shadow my-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                    Job Distribution by Employment Type
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Comparison of full-time vs part-time job postings
                                </p>
                            </div>
                            <div className="flex gap-3 flex-wrap ">
                                <div className="flex items-center ">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                                    <span className="text-xs text-gray-600 ">Full-Time</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                                    <span className="text-xs text-gray-600">Part-Time</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-80">
                            <BarChart
                                xAxis={[
                                    {
                                        scaleType: 'band',
                                        data: applicantsTypeLabels,
                                        categoryGapRatio: 0.4,
                                        barGapRatio: 0.2,
                                        label: 'Employee Type',
                                        labelStyle: {
                                            fontSize: 12,
                                            fill: '#6b7280',
                                        },
                                        tickLabelStyle: {
                                            fontSize: 11,
                                            fill: '#6b7280',
                                        },
                                    },
                                ]}
                                yAxis={[
                                    {
                                        label: 'Job Count',
                                        labelStyle: {
                                            fontSize: 12,
                                            fill: '#6b7280',
                                        },
                                        tickLabelStyle: {
                                            fontSize: 11,
                                            fill: '#6b7280',
                                        },
                                    },
                                ]}
                                series={[
                                    {
                                        data: applicansTypeData,
                                        label: 'Full-Time',
                                        color: '#6366f1', // Indigo-500
                                        highlightScope: {
                                            highlighted: 'series',
                                            faded: 'global',
                                        },
                                    },
                                    {
                                        data: [1, 6, 3],
                                        label: 'Part-Time',
                                        color: '#10b981', // Emerald-500
                                        highlightScope: {
                                            highlighted: 'series',
                                            faded: 'global',
                                        },
                                    },
                                ]}
                                height={300}
                                width={500}
                                slotProps={{
                                    legend: {
                                        direction: 'row',
                                        position: { vertical: 'top', horizontal: 'right' },
                                        itemMarkWidth: 8,
                                        itemMarkHeight: 8,
                                        labelStyle: {
                                            fontSize: 12,
                                        },
                                        padding: { top: 20 },
                                    },
                                }}
                                margin={{ top: 20, bottom: 50, left: 50, right: 20 }}
                                grid={{
                                    horizontal: true,
                                    stroke: '#e5e7eb',
                                    strokeDasharray: '3 3',
                                }}
                                axisHighlight={{
                                    x: 'line',
                                    y: 'line',
                                }}
                                tooltip={{
                                    trigger: 'item',
                                }}
                            />
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                                Updated {new Date().toLocaleDateString()}
                            </p>
                            <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                                {/* View detailed report */}
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg> */}
                            </button>
                        </div>
                    </div>
                    <ActiveJobsTable sendJobsToParent={handleReceivedJobs} />
                </div>
            </div>
        </>
    )
}

export default ActiveJobs