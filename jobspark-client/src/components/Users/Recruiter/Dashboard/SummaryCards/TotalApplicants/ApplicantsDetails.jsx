import React, { useContext, useEffect, useState } from 'react'
import { AiFillSchedule } from 'react-icons/ai';
import { useLoaderData, useLocation, useParams } from 'react-router'
import { getMethod } from '../../../../../Utils/Api';
import { AuthContext } from './../../../../../Context/AuthContextProvider';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoDocument } from "react-icons/io5";
import { FaClipboardUser } from "react-icons/fa6";
import { IoTimerSharp } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { MdEmail } from "react-icons/md";
// import { LuPuzzle } from "react-icons/lu";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaUserClock } from "react-icons/fa";
import TotalApplicants from './TotalApplicants';
import { TotalApplicationContext } from '../../../../../Context/TotalApplicationProvider';



const ApplicantsDetails = () => {

    const data = useLoaderData();
    console.log("Data =====", data);
    const jobId = data.data.jobAppliedInfo.job._id;

    // const { recruiterAction } = useContext(TotalApplicants);
    // const { appliedInfo, allApplicantsInfo, newApplicantsToday } = useContext(TotalApplicationContext);

    const { recruiterAction } = useContext(TotalApplicationContext);

    const urlId = useParams();
    const recruiteId = urlId.recruiterId;
    const applicantId = urlId.applicantId;


    const [status, setStatus] = useState("");
    const [recruiterMsg, setRecruiterMsg] = useState("");

    const handleRecruiterAction = async (actionType) => {
        console.log("Action Type : ", actionType);
        if (status) return;

        const url = `http://localhost:5000/api/v1/recruiter/${recruiteId}/applicant/${applicantId}`

        const payloadData = {
            recruiter: recruiteId,
            job: jobId,
            applicant: applicantId,
            status: actionType,
            message: recruiterMsg || (
                actionType === "shortlisted"
                    ? "Candidate Shows Potential"
                    : "Candidate not suitable for this role"
            ),
        }

        const response = await recruiterAction(url, payloadData);
        if (response.status === true) {
            console.log("Response ===", response);
            alert(actionType);
            setStatus(actionType);
            setRecruiterMsg("");
        } else {
            console.log("Error ===", response);
            alert("Error");
        }

    }

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/recruiter/${recruiteId}/applicant/${applicantId}/job/${jobId}/status`);
                const result = await response.json();
                if (result.status) {
                    setStatus(result.status); // e.g., 'shortlisted' or 'rejected'
                }
            } catch (err) {
                console.error("Error fetching status", err);
            }
        };

        fetchStatus();
    }, []);



    const candidate = data.data?.applicant;
    const jobAppliedInfo = data.data?.jobAppliedInfo;
    const jobInfo = data.data?.jobAppliedInfo?.job;


    const [activeTab, setActiveTab] = useState("application");
    const handleApplication = (e) => {
        e.preventDefault();
        setActiveTab("application");
    }

    const handleResume = (e) => {
        e.preventDefault();
        setActiveTab("resume");  // Changed from "recent" to "resume"
    }


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Applicant Header */}
            <div className="flex items-center space-x-6  rounded-xl px-6 py-4 bg-white shadow mb-6">
                {/* Avatar */}
                <img
                    src={"https://ui-avatars.com/api/?name=" + encodeURIComponent(data.data?.applicant.name || "User")}
                    alt="Applicant Avatar"
                    className="w-16 h-16 rounded-full object-cover border"
                />
                {/* Name & Info */}
                <div className="flex-1">
                    <div className="font-semibold text-xl">{data.data?.applicant.name || "N/A"}</div>
                    <div className="flex gap-8 mt-2 text-sm text-gray-600">
                        <div>
                            <span className="font-medium">Location: </span>
                            {data.data?.applicant.location || "N/A"}
                        </div>
                        <div>
                            <span className="font-medium">Applied At: </span>
                            {data.data?.jobAppliedInfo?.appliedAt
                                ? new Date(data.data.jobAppliedInfo.appliedAt).toLocaleDateString()
                                : "N/A"}
                        </div>
                        <div>
                            <span className="font-medium">Job Applied: </span>
                            {data.data?.jobAppliedInfo?.job?.jobTitle || "N/A"}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-12">

                    {status ? (
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-sm ${status === "shortlisted" ? "bg-green-500" : "bg-red-500"
                                }`}
                        >
                            {status === "shortlisted" ? "Already Shortlisted" : "Already Rejected"}
                        </span>
                    ) : (
                        <div className="dropdown dropdown-start">
                            <button
                                tabIndex={0}
                                className="bg-white shadow rounded-full p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                            >
                                <BsThreeDotsVertical size={18} />
                            </button>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box w-36 p-2 shadow"
                            >
                                <li>
                                    <button onClick={() => handleRecruiterAction("shortlisted")}>
                                        Shortlist
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => handleRecruiterAction("rejected")}>
                                        Reject
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}


                    <button className="btn btn-primary ml-2">
                        Send Email
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex gap-6">
                {/* Left: Application Details */}
                <div className="flex-[2] bg-white rounded-2xl  shadow-lg p-8">
                    {/* Tab Navigation */}
                    <div className="flex gap-4 mb-6">
                        <div className="flex gap-4 mb-6">
                            {/* Application Button */}
                            <button
                                onClick={handleApplication}
                                className={`cursor-pointer flex items-center px-4 py-2 rounded-full font-medium shadow transition gap-2 ${activeTab === "application"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <FaClipboardUser size={18} />
                                Job Application
                            </button>

                            {/* Resume Button */}
                            <button
                                onClick={handleResume}
                                className={`cursor-pointer flex items-center px-4 py-2 rounded-full font-medium shadow transition gap-2 ${activeTab === "resume"
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                <IoDocument size={18} />
                                Resume
                            </button>
                            {activeTab === "application" ? (
                                <div>Application Content</div>
                            ) : (
                                <div>Resume Content</div>
                            )}
                        </div>

                    </div>


                    {/* Job Details Card */}
                    <div className=" px-8 py-6 mb-6">
                        {/* job application */}
                        {activeTab === "application" && (

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-2xl text-gray-800">{data.data?.jobAppliedInfo?.job?.jobTitle || "Software Developer"}</h2>
                                    {/* <span className="badge badge-neutral badge-outline">
                                        {jobInfo.employeeType || "FullTime"}
                                    </span> */}
                                </div>
                                <div className="flex flex-wrap gap-6 mb-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                        <IoLocationSharp className="text-blue-500" />
                                        <span>{jobInfo?.location || "BD"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MdAttachMoney className="text-green-600" />
                                        <span>{jobInfo?.salary || "N/A"}</span>
                                    </div>
                                    {/* <div className="flex items-center gap-2">
                                        <AiFillSchedule className="text-purple-500" />
                                        <span>Applied: {data.data?.appliedAt ? new Date(data.data.appliedAt).toLocaleDateString() : "N/A"}</span>
                                    </div> */}
                                    <span className="flex items-center gap-1">
                                        <FaUserClock />
                                        {jobInfo.employeeType || "FullTime"}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-gray-700">You must know this: </span>
                                    {Array.isArray(data.data?.jobAppliedInfo?.job?.qualification) ? (
                                        <ol className="list-decimal list-inside">
                                            {data.data.jobAppliedInfo.job.qualification.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.trim().endsWith('.') ? item.trim() : item.trim() + '.'}
                                                </li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <span>{data.data?.jobAppliedInfo?.job?.qualification || "N/A"}</span>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <span className="font-semibold text-gray-700">Responsibility:</span>
                                    {typeof data.data?.jobAppliedInfo?.job?.responsibility === 'string' ? (
                                        <div className="space-y-1 mt-1">
                                            {data.data.jobAppliedInfo.job.responsibility
                                                .split('.')
                                                .map((sentence, idx) => {
                                                    const trimmed = sentence.trim();
                                                    if (!trimmed) return null;
                                                    return (
                                                        <p key={idx}>
                                                            {`${idx + 1}. ${trimmed}.`}
                                                        </p>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <span>{data.data?.jobAppliedInfo?.job?.responsibility || "N/A"}</span>
                                    )}
                                </div>

                                <div>
                                    <span className="font-semibold text-gray-700">Description: </span>
                                    <span>{data.data?.jobAppliedInfo?.job?.description || "N/A"}</span>
                                </div>
                            </div>
                        )}
                        {/* show resume */}
                        {activeTab === "resume" && (
                            <div className="resume-content">
                                {/* Add your resume content here */}
                                <p>Resume content will appear here</p>
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatibus beatae ducimus, dolorem odit corporis aperiam facilis molestias, rerum quia facere nulla eligendi sint quo. Quos iure sint nam commodi perferendis?
                            </div>
                        )}
                    </div>
                    {/* Application Status */}
                    {/* <div className="flex items-center gap-3 mt-2">
                        <span className="badge badge-neutral badge-outline">
                            Status: {data.data?.applicationStatus || "Pending"}
                        </span>
                    </div> */}
                </div>

                <div className="flex-1 ">
                    <div className='rounded-2xl shadow px-6 py-4 bg-white'>
                        <h3 className="font-semibold text-lg mb-2">About Applicant</h3>
                        {data.data?.applicant ? (
                            <div className='flex'>

                                <div className="">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="flex items-center gap-1"><MdEmail /> Email </p>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="flex items-center gap-1"><FaClipboardUser /> Role</p>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="flex items-center gap-1"><IoTimerSharp /> Experience</p>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="flex items-center gap-1"><IoDocument /> University</p>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="flex items-center gap-1"><IoExtensionPuzzle />
                                            Skills</p>
                                    </div>
                                </div>
                                <div>
                                    <div className="space-y-3 ml-10">
                                        {/* Email */}
                                        <div className='mb-4'>
                                            <span className="badge badge-neutral badge-outline text-sm">
                                                {candidate?.email || "N/A"}
                                            </span>
                                        </div>

                                        {/* Role */}
                                        <div className='mb-4'>
                                            <span className="badge badge-primary badge-outline text-sm">
                                                {candidate?.role || "N/A"}
                                            </span>
                                        </div>

                                        {/* Experience Level */}
                                        <div className='mb-4'>
                                            <span className="badge badge-info badge-outline text-sm">
                                                {candidate?.experienceLevel || "N/A"}
                                            </span>
                                        </div>

                                        {/* University */}
                                        <div className='mb-4'>
                                            <span className="badge badge-accent badge-outline text-sm">
                                                {candidate?.university || "N/A"}
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div className='mb-4'>
                                            {Array.isArray(candidate?.skills) ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {candidate.skills.map((skill, index) => (
                                                        <span key={index} className=" text-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="badge badge-outline text-sm">
                                                    {candidate?.skills || "N/A"}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700 text-sm">
                                No additional information provided by the applicant.
                            </p>
                        )}
                    </div>
                    {/* Recruiter Comments */}
                    <div className='rounded-2xl shadow-lg px-6 py-4 mt-6 bg-white'>
                        <label className="block mb-2 font-semibold text-lg" htmlFor="recruiter-comments">
                            Recruiter Comments
                        </label>
                        <textarea
                            name='comments'
                            id="recruiter-comments"
                            className="w-full rounded-xl p-4 mb-4 border-none resize-none"
                            rows={5}
                            value={recruiterMsg}
                            onChange={(e) => setRecruiterMsg(e.target.value)}
                        />
                        {/* <button
                            type="button"
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg  transition"
                        >
                            Submit
                        </button> */}
                    </div>

                </div>
            </div>
        </div>
    )

}

export default ApplicantsDetails