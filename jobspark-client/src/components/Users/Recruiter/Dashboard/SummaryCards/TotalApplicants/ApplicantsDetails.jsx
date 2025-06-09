import React, { useState } from 'react'
import { AiFillSchedule } from 'react-icons/ai';
import { useLoaderData, useLocation, useParams } from 'react-router'
import { getMethod } from '../../../../../Utils/Api';
import { AuthContext } from './../../../../../Context/AuthContextProvider';
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoDocument } from "react-icons/io5";
import { FaClipboardUser } from "react-icons/fa6";




const ApplicantsDetails = () => {

    const data = useLoaderData();
    console.log("Data =====", data);

    const urlId = useParams();
    // console.log("Url id=== ", urlId);
    // console.log("Applicantq id=== ", urlId.applicantId);

    const [status, setStatus] = useState("");

    const handleRecruiterAction = (actionType) => {
        console.log("Action Type : ", actionType);
        if (status) return;

        const sendingData = {
            job: "",
            // applicant: urlId.applicantId,
            // recruiter: urlId.recruiterId,
            status: actionType,
            message: actionType === "shortlisted" ? "Candidate shows great potential" : "Candidate doesn't match"
        }

    }



    return (
        <>
            <div>
                <div className="flex items-center space-x-4 mt-2 border px-4 bg-white ">
                    {/* Avatar */}
                    <img
                        src="https://images.pexels.com/photos/32481220/pexels-photo-32481220/free-photo-of-scenic-view-of-sivas-lake-with-two-people.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    {/* Name */}
                    <div className="flex-1 items-center">
                        <div>
                            <div className="font-semibold text-lg">
                                {data.data?.userName || "N/A"}
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='text-sm'>
                                <span className='text-[#6c757d]'>Location</span>
                                <p>Bangladesh, Dhaka</p>
                            </div>
                            <div className='text-sm'>
                                <span className='text-[#6c757d]'>Applied At</span>
                                <p>Bangladesh, Dhaka</p>
                            </div>
                            <div className='text-sm'>
                                <span className='text-[#6c757d]'>Jop Applied</span>
                                <p>Bangladesh, Dhaka</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <div tabIndex={0} role="button" className="bg-white shadow rounded-full p-2 flex items-center justify-center cursor-pointer">
                            <BsThreeDotsVertical />
                        </div>
                        <div className="divider lg:divider-horizontal"></div>
                        <button className='btn btn-primary'>
                            Send Email
                        </button>
                    </div>
                </div>
                <div className='flex my-8 border px-4'>
                    <div className='flex-[3] pr-4'>
                        <div className='flex gap-4'>
                            <button className='flex items-center btn btn-active rounded-full'>
                                <FaClipboardUser size={20} /> Job Applications
                            </button>
                            <button className='flex items-center btn rounded-full '>
                                <IoDocument size={20} /> Resume
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border shadow-2xl">
                            <h2>
                                Jobs Applied
                            </h2>
                            <p>Software Developer</p>
                            <div>
                               x <div>
                                    fullTime 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1'>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas sequi, perferendis illum ea reprehenderit quod! Quae, est perspiciatis ipsum quasi voluptatibus vero cum eius pariatur fugiat voluptatem sapiente beatae doloremque consequuntur consectetur autem, deserunt id nam cumque illo necessitatibus ratione. Eligendi nobis illum voluptatem esse modi veniam ex asperiores error!
                    </div>
                </div>
                <div>
                </div>
                <div className="mt-4">
                    <div className="dropdown dropdown-start">
                        <div tabIndex={0} role="button" className="btn m-1">Action</div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                            <li>
                                <button onClick={() => handleRecruiterAction('shortlisted')}>Shortlist</button>
                            </li>
                            <li>
                                <button onClick={() => handleRecruiterAction('rejected')}>Reject</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ApplicantsDetails