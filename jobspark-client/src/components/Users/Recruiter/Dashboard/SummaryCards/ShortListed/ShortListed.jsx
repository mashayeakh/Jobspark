import React, { useContext, useEffect, useState } from 'react'
import { FaSort } from 'react-icons/fa6'
import { TotalApplicationContext } from './../../../../../Context/TotalApplicationProvider';
import { AuthContext } from '../../../../../Context/AuthContextProvider';

const ShortListed = () => {


    const { getShortlistedApplicants, sendSchedule } = useContext(TotalApplicationContext);
    const { user } = useContext(AuthContext);

    console.log("User === ", user);

    const recruiterId = user?._id;


    const [shortlistedApplicant, setShortlistedApplicant] = useState({});
    const [selectedApplicant, setSelectedApplicant] = useState(null);


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
    console.log("Short liste ", shortlistedApplicant.data?.applicantId);


    // //!sending scheduling to applicant through email
    const [disabledApplicantIds, setDisabledApplicantIds] = useState([]);

    const sendingSchedule = async (e) => {
        e.preventDefault();

        const data = {
            recruiter: e.target.recruiter_id.value.trim(),
            applicant: e.target.applicantId.value.trim(),
            job: e.target.jobId.value.trim(),
            dateTime: new Date(e.target.dateTime.value).toISOString(),
            interviewType: e.target.interviewType.value.trim(),
            notes: e.target.notes.value.trim(),
        };

        console.log("Data =", data);
        const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/interviews/schedule`;

        try {
            const response = await sendSchedule(url, data);

            if (response.status === true || response.message === "Interview Scheduled Successfully") {
                alert("Interview scheduled successfully");
                setDisabledApplicantIds(prev => [...prev, data.applicant.trim()]);
                e.target.reset();
                document.getElementById('my_modal_5').close();
            } else if (response.status === false) {
                alert(response.message || "Failed to schedule interview");
            } else {
                alert("Unexpected response from server");
            }
        } catch (error) {
            console.error("Error scheduling interview:", error);
            alert(`Interview already scheduled for this applicant and job.`);
        }
    };




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


                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-2">Schedule Interview</h3>
                        <form onSubmit={sendingSchedule} className="space-y-4">
                            <div>
                                <label className="label font-medium">Recruiter Id</label>
                                <input
                                    name="recruiter_id"
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder='0000000000'
                                    defaultValue={recruiterId}
                                    required
                                    readOnly
                                />

                            </div>
                            <div>
                                <label className="label font-medium">Job Id</label>
                                <input
                                    name="jobId"
                                    defaultValue={selectedApplicant?.jobId}
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder='0000000000'
                                    required
                                    readOnly
                                />

                            </div>
                            <div>
                                <label className="label font-medium">Applicant Id</label>
                                <input
                                    name="applicantId"
                                    defaultValue={selectedApplicant?.applicantId}
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder='0000000000'
                                    required
                                    readOnly
                                />

                            </div>
                            <div>
                                <label className="label font-medium">Date &amp; Time</label>
                                <input
                                    name="dateTime"
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="label font-medium">Interview Type</label>
                                <select name="interviewType" className="select select-bordered w-full" required>
                                    <option value="">Select type</option>
                                    <option value="Google Meet">Google Meet (Online) </option>
                                    <option value="Zoom">Zoom (Online)</option>
                                    {/* <option value="phone">Phone</option> */}
                                </select>
                            </div>
                            <div>
                                <label className="label font-medium">Notes (optional)</label>
                                <textarea
                                    name='notes'
                                    className="textarea textarea-bordered w-full"
                                    placeholder="Add any notes for the candidate..."
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="submit" className="btn btn-primary">
                                    Send Schedule
                                </button>
                                <form method="dialog">
                                    <button className="btn">Close</button>
                                </form>
                            </div>
                        </form>
                    </div>
                </dialog>
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

                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => {
                                                        setSelectedApplicant(applicant);
                                                        document.getElementById('my_modal_5').showModal();
                                                    }}
                                                    disabled={disabledApplicantIds.includes((applicant._id || "").toString().trim())}
                                                >
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