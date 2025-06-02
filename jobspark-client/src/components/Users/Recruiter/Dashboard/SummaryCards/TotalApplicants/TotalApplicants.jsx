import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import { TotalApplicationContext } from '../../../../../Context/TotalApplicationProvider';
import Google from '../../../../../../assets/imgs/companyLogo/google.png';
import { FaCode, FaSort } from 'react-icons/fa';
import { MdGridView } from "react-icons/md";
import { MdOutlineTableChart } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { BsBriefcase } from "react-icons/bs";



const TotalApplicants = () => {

    const { appliedInfo, allApplicantsInfo } = useContext(TotalApplicationContext);
    const { user } = useContext(AuthContext);
    const [showDataInfo, setShowDataInfo] = useState({});
    const [showAllApplicantsInfo, setShowAllApplicantsInfo] = useState({});

    const [view, setView] = useState(true);

    console.log("Uer id ", user?._id);


    const showInfo = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applications`
        try {
            const data = await appliedInfo(url);
            if (data.status === true) {
                setShowDataInfo(data);
                console.log("Data from total Application", data);
            } else {
                console.log("Err form total Application",);
            }
        } catch (err) {
            console.log("Err from total Application", err.message);
        }
    }


    console.log("Sow Data Info", showDataInfo);
    const totalApplicants = showDataInfo.data?.jobs.map(j => j?.applicantsCount || 0).reduce((acc, crrVal) => acc + crrVal, 0)
    // console.log("Sow Data Info000000000", showDataInfo.data?.jobs.map(j => j?.applicantsCount).reduce((acc, crrVal) => acc + crrVal, 0));
    console.log("Total Applicants ", totalApplicants);


    //?  get all the all user to show in table.
    const showAllInfo = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applicants-info`
        try {
            const data = await allApplicantsInfo(url);
            if (data.status === true) {
                setShowAllApplicantsInfo(data);
                console.log("All Applications ", data);
            } else {
                console.log("Err form total Application",);
            }
        } catch (err) {
            console.log("Err from total Application", err.message);
        }
    }

    useEffect(() => {
        if (!user?._id) return;
        showInfo();
        showAllInfo();
    }, [user?._id])

    console.log("Show all Applicants Info", showAllApplicantsInfo);

    console.log("Result ", showAllApplicantsInfo.data?.jobInfo);
    console.log("Result2 ", showAllApplicantsInfo.data?.userInfo);

    const jobInfo = showAllApplicantsInfo.data?.jobInfo;
    const userInfo = showAllApplicantsInfo.data?.userInfo;

    console.log("User Info", userInfo);


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-2 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* /* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 tracking-tight">
                        Total Applications: <span className="text-blue-600">{totalApplicants || 0}</span>
                    </h2>
                </div>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center border-t-4 border-blue-500 hover:shadow-xl transition">
                        <img src={Google} alt="Company Logo" className="w-10 mb-3 rounded-full shadow mx-auto" />
                        <h3 className="text-xs font-semibold mb-1 text-gray-600 uppercase tracking-wide">Total Applications</h3>
                        <span className="text-2xl font-bold text-blue-600">{totalApplicants || 0}</span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center border-t-4 border-green-500 hover:shadow-xl transition">
                        <img src={Google} alt="Company Logo" className="w-10 mb-3 rounded-full shadow mx-auto" />
                        <h3 className="text-xs font-semibold mb-1 text-gray-600 uppercase tracking-wide">New Today</h3>
                        <span className="text-2xl font-bold text-green-600">7</span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center border-t-4 border-yellow-400 hover:shadow-xl transition">
                        <img src={Google} alt="Company Logo" className="w-10 mb-3 rounded-full shadow mx-auto" />
                        <h3 className="text-xs font-semibold mb-1 text-gray-600 uppercase tracking-wide">Shortlisted</h3>
                        <span className="text-2xl font-bold text-yellow-500">123</span>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center border-t-4 border-red-500 hover:shadow-xl transition">
                        <img src={Google} alt="Company Logo" className="w-10 mb-3 rounded-full shadow mx-auto" />
                        <h3 className="text-xs font-semibold mb-1 text-gray-600 uppercase tracking-wide">Rejected</h3>
                        <span className="text-2xl font-bold text-red-500">123</span>
                    </div>
                </div>
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <label className="flex items-center rounded-lg px-3 py-2 bg-white shadow-sm w-full md:w-1/2">
                        <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input type="search" required placeholder="Search applicants..." className="outline-none w-full bg-transparent text-sm" />
                    </label>
                    <div className="flex flex-row items-center gap-2 w-full md:w-1/4">
                        <label htmlFor="filter" className="text-gray-600 font-medium text-sm">Filter by</label>
                        <select className="select select-bordered w-full text-sm py-1">
                            <option>All</option>
                            <option>Chrome</option>
                            <option>FireFox</option>
                            <option>Safari</option>
                        </select>
                    </div>
                    <div className="flex flex-row items-center gap-2 w-full md:w-1/4">
                        <label htmlFor="" className="text-gray-600 font-medium text-sm">Status</label>
                        <select className="select select-bordered w-full text-sm py-1">
                            <option>All</option>
                            <option>Chrome</option>
                            <option>FireFox</option>
                            <option>Safari</option>
                        </select>
                    </div>
                    <div className="dropdown dropdown-end flex items-center">
                        <div tabIndex={0} role="button" className="btn btn-ghost rounded-lg text-xs flex items-center gap-2 px-2 py-1">
                            <FaSort size={16} className="transition-transform duration-150 active:scale-90 cursor-pointer" />
                            Sort By
                        </div>
                        <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-10 mt-2 w-24 p-1 shadow text-xs">
                            <li><a>Newest</a></li>
                            <li><a>Oldest</a></li>
                        </ul>
                    </div>
                </div>
                {/* Applicants List */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Applicants List</h2>
                        <div className="flex space-x-4">
                            <MdGridView
                                size={28}
                                cursor="pointer"
                                className={`transition-transform duration-150 active:scale-90 ${view ? "text-blue-600" : "text-gray-400"}`}
                                onClick={() => setView(true)}
                                title="Grid View"
                            />
                            <MdOutlineTableChart
                                size={28}
                                cursor="pointer"
                                className={`transition-transform duration-150 active:scale-90 ${!view ? "text-blue-600" : "text-gray-400"}`}
                                onClick={() => setView(false)}
                                title="Table View"
                            />
                        </div>
                    </div>
                    {view ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {/* Example applicant card with action button on the right */}
                            {userInfo?.map((uInfo, idx) => (
                                <div key={uInfo?._id || idx} className="w-full max-w-xs bg-gradient-to-br from-blue-100 to-white border border-gray-200 rounded-xl shadow transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-400 group">
                                    <div className="flex flex-col">
                                        <div className="flex justify-end px-4 ">
                                            <div className="dropdown dropdown-end">
                                                <div tabIndex={0} role="button" className="inline-block text-gray-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5">
                                                    <span className="sr-only">Open dropdown</span>
                                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                                    </svg>
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-30 p-2 shadow">
                                                    <li><a>View Profile</a></li>
                                                    <li><a>Shortlist</a></li>
                                                    <li><a>Reject</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center p-5 pt-2">
                                            <img className="w-16 h-16 rounded-full shadow-lg ring-2 ring-blue-500 mb-2" src="https://randomuser.me/api/portraits/women/79.jpg" alt={uInfo?.name || "Applicant"} />
                                            <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">{uInfo?.name}</p>
                                            <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-200 mb-2">Visual Designer</p>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {/* Render skills as separate badges */}
                                                {Array.isArray(uInfo?.skills) && uInfo.skills.length > 0 && uInfo.skills[0]
                                                    ? uInfo.skills[0].split(',').map((skill, i) => (
                                                        <span key={i} className="badge badge-neutral badge-outline badge-sm">{skill.trim()}</span>
                                                    ))
                                                    : null
                                                }
                                            </div>
                                            <div className="text-xs text-gray-600 text-center">
                                                Applied to - {
                                                    jobInfo?.map(job => (
                                                        job?.jobTitle
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : ""
                    }
                </div>
            </div>
        </div>
    );
}

export default TotalApplicants