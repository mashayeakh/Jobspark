import React, { useContext, useEffect, useState } from 'react'
import { FaSort } from 'react-icons/fa6'
import { TotalApplicationContext } from './../../../../../Context/TotalApplicationProvider';
import { AuthContext } from '../../../../../Context/AuthContextProvider';

const ShortListed = () => {


    const { getShortlistedApplicants } = useContext(TotalApplicationContext);
    const { user } = useContext(AuthContext);

    console.log("User === ", user);

    const recruiterId = user?._id;


    const [shortlistedApplicant, setShortlistedApplicant] = useState({});

    const showShortlistedApplicants = async () => {

        try {
            const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/shortlisted-Candidates`;
            const response = await getShortlistedApplicants(url);
            if (response.status === true) {
                setShortlistedApplicant(response);
                console.log("Response ========  ", response);
            }
        } catch (err) {
            console.error("Error fetching today's applications from sever -  shortlisted:", err.message);
        }
    }


    useEffect(() => {
        if (!recruiterId) return;
        showShortlistedApplicants()
    }, [recruiterId])





    console.log("Short liste ", shortlistedApplicant);
    console.log("Short liste ", shortlistedApplicant);

    return (
        <>

            <div>
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
            </div>

            <div className='mt-8 '>
                <div className='my-4'>
                    <p className='text-3xl'>Shortlisted Applicants</p>
                </div>
                {/* table contents */}
                <div className="overflow-x-auto  bg-white rounded-2xl shadow-lg p-4">
                    {shortlistedApplicant?.data?.length > 0 ? (
                        <div className="overflow-x-auto shadow rounded border">
                            <table className="table w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th>#</th>
                                        <th>Candidate Name</th>
                                        <th>Email</th>
                                        <th>University</th>
                                        <th>Skills</th>
                                        <th>Experience</th>
                                        <th>Job Title</th>
                                        <th>🔧 Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shortlistedApplicant.data.map((applicant, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{applicant.name}</td>
                                            <td>{applicant.email}</td>
                                            <td>{applicant.university}</td>
                                            <td>{applicant.skills}</td>
                                            <td>{applicant.experienceLevel}</td>
                                            <td>{applicant.jobTitle}</td>
                                            <td>
                                                <button className="btn btn-primary btn-sm">
                                                    Schedule Interview
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-4">
                            No shortlisted applicants found.
                        </div>
                    )}


                </div>
            </div>



        </>
    )
}

export default ShortListed