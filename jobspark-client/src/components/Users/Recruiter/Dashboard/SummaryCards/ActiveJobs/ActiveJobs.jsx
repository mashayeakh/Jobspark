import React, { useContext, useEffect, useState } from 'react'
import { BsCheckLg, BsThreeDotsVertical } from 'react-icons/bs'
import { CiLight, CiStar } from 'react-icons/ci'
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
const ActiveJobs = () => {

    const { user } = useContext(AuthContext);
    console.log("USEr ", user);
    console.log("USEr ID", user?._id);

    const { getMostPopularJobByARecruiter } = useContext(ActiveJobsContext);
    const [showPopularJob, setShowPopularJob] = useState({})
    const [daysLeft, setDaysLeft] = useState(null)

    const populatJob = async () => {
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
        // if (!showPopularJob.data?.deadLine) return;

        populatJob();
        // getDaysLeft()
    }, [user?._id]);

    useEffect(() => {
        if (!showPopularJob?.data?.deadline) return;

        const deadLine = new Date(showPopularJob.data?.deadline);
        const today = new Date();

        console.log("Today ", today);
        console.log("Deadlinw ", deadLine);

        // Remove time for full-day difference
        //h, min, sec, milie sec.
        deadLine.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffTime = deadLine - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysLeft(diffDays);
    }, [showPopularJob]);


    console.log("Days left =", daysLeft);


    const targetApplicants = 100;
    const currentApplicants = showPopularJob.data?.applicantsCount || 0;
    console.log("Curent Appliancs", currentApplicants);
    const progress = Math.min((currentApplicants / targetApplicants) * 100, 100);
    // console.log("Progess ", currentApplicants / targetApplicants); //0.13
    // console.log("progress ", progress * 100);
    // console.log("progress ", progress*100);


    return (
        < >
            <div className="bg-[#f5efff] w-full overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 py-6">
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
                                                UX/UI Designer<br />
                                                25 Applicants • Deadline in 4 days
                                            </p>
                                        </div>

                                        {/* Chart */}
                                        <div className="flex-shrink-0 mt-4 md:mt-0">
                                            <Gauge width={100} height={100} value={60} />
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
                                                UX/UI Designer<br />
                                                25 Applicants • Deadline in 4 days
                                            </p>
                                        </div>

                                        {/* Chart */}
                                        <div className="flex-shrink-0 mt-4 md:mt-0">
                                            <Gauge width={100} height={100} value={60} />
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
                                                UX/UI Designer<br />
                                                25 Applicants • Deadline in 4 days
                                            </p>
                                        </div>

                                        {/* Chart */}
                                        <div className="flex-shrink-0 mt-4 md:mt-0">
                                            <Gauge width={100} height={100} value={60} />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <ActiveJobs_FullTime />
                    <ActiveJobsTable />
                </div>
            </div>
        </>
    )
}

export default ActiveJobs