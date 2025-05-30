import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../Context/AuthContextProvider';
import { ActiveJobsContext } from '../../../Context/ActiveJobsContextProvider';
import { Link, useLoaderData, useParams } from 'react-router';
import { IoLocationOutline } from "react-icons/io5";
import { postMethod } from '../../../Utils/Api';


const JobsDetails = () => {

    const data = useLoaderData();
    // console.log("DATA =", data.data?.jobTitle);
    // console.log("DATA ID =", data.data?._id);

    const { fetchAllActiveJobs } = useContext(ActiveJobsContext);
    const [remJobs, setRemJobs] = useState([]);

    console.log("USER ID ", data.data?._id);

    useEffect(() => {
        const allActiveJobs = async () => {
            const url = "http://localhost:5000/api/v1";
            const response = await fetchAllActiveJobs(url);
            if (response.status === true) {
                console.log("Response from  job detials", response.data);
                const remJobs = response.data.filter(job => job?._id !== data.data?._id)
                console.log("REM JOBS", remJobs);
                setRemJobs(remJobs);
            }
        }
        allActiveJobs()
    }, [data.data?._id]); // run effect only when job id changes



    const { user } = useContext(AuthContext);
    const params = useParams();

    //get the id from url
    console.log("Params Id ", params.id);

    // console.log("User Info ", user);

    const handleApplyNowBtn = async (e) => {
        e.preventDefault();
        console.log("apply now clicked");


        //send job id and user info
        const userInfoForm = {
            userInfo: user,
            currentJobId: params?.id
        }
        console.log("UserForm ", userInfoForm);

        const url = `http://localhost:5000/api/v1/apply/job/${userInfoForm.currentJobId}`
        try {
            const response = await postMethod(url, userInfoForm);
            console.log("Response:", response);

            if (response.success) {
                alert("Successfully applied!");
            } else {
                alert("Application failed.");
            }
        } catch (err) {
            console.error("Application error:", err);
            alert("Something went wrong while applying.");
        }

    }



    return (
        <div>
            <div className='py-8 px-12'>
                <div className='flex px-[8%]'>
                    <div className='w-2/3'>
                        <div className=" w-full lg:pr-8 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
                            <div className="data w-full max-w-2xl">
                                <div className='flex items-center justify-between'>
                                    <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2 capitalize">{data?.data.jobTitle}</h2>
                                    <div>
                                        <button onClick={handleApplyNowBtn} className='btn btn-primary btn-md'>
                                            Apply Now
                                        </button>
                                    </div>
                                </div>

                                <div className='flex items-center gap-3 '>
                                    <h2 className="font-manrope font-bold text-[#f72585] leading-10 text-lg  mb-2 capitalize">{data?.data.companyName}</h2>
                                    <div className='flex items-center gap-2  text-[#6B7280]'>
                                        <IoLocationOutline size={20} />
                                        <p className=''>
                                            {data?.data.location}
                                        </p>
                                        <span className="pl-2 font-normal leading-7 text-gray-500 text-sm ">
                                            <h6 className='font-manrope font-semibold badge badge-md bg-base-300 text-sm text-[#6B7280]'>
                                                {data?.data?.employeeType}
                                            </h6>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                                    <h6 className="font-manrope font-semibold badge badge-md bg-base-300 text-sm text-[#6B7280]">
                                        {data?.data?.jobCategory}
                                    </h6>
                                    <div className="divider divider-horizontal"></div>
                                    <div className="flex items-center ">
                                        <div className="flex items-center ">
                                            <h6 className='font-manrope font-semibold badge badge-md bg-base-300 text-sm text-[#6B7280]'>
                                                {data?.data?.experienceLevel}
                                            </h6>
                                        </div>
                                        <div className="divider divider-horizontal"></div>
                                        <span className="pl-2 font-normal leading-7 text-gray-500 text-sm ">
                                            <h6 className='font-manrope font-semibold badge badge-md bg-base-300 text-sm text-[#6B7280]'>
                                                {data?.data?.salary} BDT
                                            </h6>
                                        </span>

                                    </div>

                                </div>
                                <div className="text-gray-500 text-base font-normal mb-5">
                                    <p className='text-xl text-black font-bold pb-2'>
                                        Job Description
                                    </p>
                                    {data?.data?.description}
                                    <div className="text-gray-500 text-base font-normal mb-5">
                                        <p className='text-xl text-black font-bold p-2'>
                                            Qualifications
                                        </p>
                                        <ul className="list-disc pl-5">
                                            {(data?.data?.qualification || '')
                                                .split('.')
                                                .map((item, idx) => (
                                                    <li key={idx}>{item.trim()}</li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div className="text-gray-500 text-base font-normal mb-5">
                                        <p className='text-xl text-black font-bold p-2'>
                                            Responsibility
                                        </p>
                                        <ul className="list-disc pl-5">
                                            {(data?.data?.responsibility || '')
                                                .split('.')
                                                .map((item, idx) => (
                                                    <li key={idx}>{item.trim()}</li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className='w-1/3'>
                        <p className='text-2xl text-black py-4'>
                            Available jobs
                        </p>
                        <div className="flex flex-col gap-8">
                            {
                                Array.isArray(remJobs) && remJobs.length > 0 ?
                                    remJobs.map(rem => (
                                        <Link to={`/job/${rem?._id}`} key={rem._id}>
                                            <div className="card bg-base-100 w-96 shadow-lg">
                                                <div className="card-body">
                                                    <h2 className="card-title">
                                                        {rem.jobTitle}
                                                    </h2>
                                                    <div className="card-actions flex gap-4">
                                                        <div className='badge badge-secondary'>
                                                            {rem.employeeType}
                                                        </div>
                                                        <div className='badge badge-primary'>
                                                            {rem.jobCategory}
                                                        </div>
                                                        <div className='badge badge-warning'>
                                                            {rem.status}
                                                        </div>
                                                    </div>
                                                    <p className='pt-2'>
                                                        {rem.skills}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    )) : ""
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default JobsDetails