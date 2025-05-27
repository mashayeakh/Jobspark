import React from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { CiStar } from 'react-icons/ci'
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaCode } from 'react-icons/fa';
import { MdOutlinePeople } from 'react-icons/md';
import { RiBriefcase4Line } from 'react-icons/ri';
import Stack from '@mui/material/Stack';
import { Gauge } from '@mui/x-charts/Gauge';
import ActiveJobs_FullTime from './ActiveJobs_FullTime';
import ActiveJobsTable from './ActiveJobsTable';
const ActiveJobs = () => {
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