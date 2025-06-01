import React, { useContext, useEffect, useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { postMethod } from "../../../../../Utils/Api"
import { Link } from 'react-router';
import { ActiveJobsContext } from '../../../../../Context/ActiveJobsContextProvider';
import { AuthContext } from '../../../../../Context/AuthContextProvider';

const ActiveJobsTable = ({ sendJobsToParent }) => {

    const { user } = useContext(AuthContext);

    const recruiterId = user?._id;

    console.log("Recruiter id ", recruiterId);


    const handleAddJobs = async (e) => {
        e.preventDefault();
        console.log("Form Submitted");

        const addJobs = {
            recruiter: recruiterId, //this is the place where specific user can create specific jobs

            jobTitle: e.target.job_title.value.trim(),
            companyName: e.target.company_name.value.trim(),
            location: e.target.location.value.trim(),
            employeeType: e.target.emp_type.value.trim(),
            experienceLevel: e.target.exp_level.value.trim(),
            jobCategory: e.target.job_category.value.trim(),
            skills: e.target.skills.value.trim(),
            salary: e.target.salary.value.trim(),
            deadline: e.target.deadline.value.trim(),
            status: e.target.status.value.trim(),
            qualification: e.target.qualification.value.trim(),
            responsibility: e.target.responsibility.value.trim(),
            description: e.target.description.value.trim(),
        }
        console.log("Add Jobs = ", addJobs);

        try {
            const url = "http://localhost:5000/api/v1/job"
            const data = await postMethod(url, addJobs);
            if (data.success === "true") {
                console.log("Dataaaaa = ", data);
                alert("Job Added Successfully");
                // window.location.reload();
                e.target.reset();
            }


        } catch (err) {
            console.log("Err from client while post req, ", err.message);
        }

    }

    console.log("user id", user?._id);

    const { fetchRecruiterAllActiveJobs } = useContext(ActiveJobsContext);
    const [actJobs, setActJobs] = useState([]);

    const fetchActiveJobs = async () => {
        try {
            const url = `http://localhost:5000/api/v1/recruiter?recruiterId=${user._id}`;
            console.log("Fetch URL: ", url);
            const data = await fetchRecruiterAllActiveJobs(url);
            console.log("Returned Data: ", data);

            if (data.success) {
                setActJobs(data.data);
                sendJobsToParent && sendJobsToParent(data.data); 
            }
        } catch (err) {
            console.log("Err from Client - ", err.message);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchActiveJobs();
        }
    }, [user?._id]);

    console.log("Act Jobssss ", actJobs); // ✅ fixed


    return (
        <div>
            <div className="overflow-x-auto shadow-2xl rounded-4xl bg-white ">
                <div className='flex items-center justify-between mb-4 px-12 pt-4 '>
                    <p className='text-2xl text-green-800 font-bold'>Active Jobs
                        <span className='text-sm text-gray-500 badge-accent ml-2'> (Total: {actJobs.length})</span>
                    </p>

                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                    <button className="" onClick={() => document.getElementById('my_modal_1').showModal()}>

                        <th>
                            <div>
                                <button className="btn btn-outline btn-primary btn-lg">
                                    <IoMdAdd size={24} />  Add Jobs
                                </button>
                            </div>
                        </th>

                    </button>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box w-full max-w-3xl">
                            <p className="py-4 text-xl">Create Jobs</p>
                            <div className="">

                                {/* if there is a button in form, it will close the modal */}

                                <form onSubmit={handleAddJobs} method="dialog" className="max-w-4xl mx-auto pb-5 px-10">
                                    <div className="flex gap-6">
                                        {/* Username Field */}
                                        <div className="flex-1 pb-8">
                                            <label className="input validator w-full">
                                                <input
                                                    type="text"
                                                    required
                                                    name="job_title"
                                                    placeholder="Job Title"
                                                    className="w-full"
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <label className="input validator w-full">
                                                <input
                                                    type="text"
                                                    required
                                                    name="company_name"
                                                    placeholder="Company Name"
                                                    className="w-full"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        {/* Username Field */}
                                        <div className="flex-1 pb-8">
                                            <label className="input validator w-full">

                                                <input
                                                    type="text"
                                                    required
                                                    name="location"
                                                    placeholder="Location"
                                                    className="w-full"
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <select defaultValue="Employee Type" name="emp_type" className="select">
                                                <option disabled={true}>Employee Type</option>
                                                {/* 'Full time', 'Part time', 'Internship' */}
                                                <option value={"Full time"}>Full time</option>
                                                <option value={"Part time"}>Part time</option>
                                                <option value={"Internship"}>Internship</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        {/* Username Field */}
                                        <div className="flex-1 pb-8">
                                            <select defaultValue="Experience Level" name="exp_level" className="select">
                                                <option disabled={true}>Experience Level</option>
                                                {/* Entry', 'Mid', 'Senior */}
                                                <option value={"Entry"}>Entry</option>
                                                <option value={"Mid"}>Mid</option>
                                                <option value={"Senior"}>Senior</option>
                                            </select>
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <select defaultValue="Job Category" name="job_category" className="select">
                                                <option disabled={true}>Job Category</option>
                                                {/* Engineering', 'Design', 'Marketing */}
                                                <option value={"Engineering"}>Engineering</option>
                                                <option value={"Design"}>Design</option>
                                                <option value={"Marketing"}>Marketing</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        {/* Username Field */}
                                        <div className="flex-1 pb-8">
                                            <label className="input validator w-full">
                                                <input
                                                    type="text"
                                                    name="skills"
                                                    placeholder="React, Node.js, CSS"
                                                    className="w-full placeholder:text-sm"
                                                />
                                            </label>
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <label className="input validator w-full">

                                                <input
                                                    type="number"
                                                    required
                                                    name="salary"
                                                    placeholder="Salary"
                                                    className="w-full"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        {/* Calendar Field */}
                                        <div className="flex-1 pb-8">
                                            <label className="input validator w-full">
                                                <input
                                                    type="date"
                                                    required
                                                    name="deadline"
                                                    placeholder="Deadline (YYYY-MM-DD)"
                                                    pattern="\d{4}-\d{2}-\d{2}"
                                                    className="w-full placeholder:text-sm"
                                                />
                                            </label>
                                            <small>Deadline</small>
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <select defaultValue="Status" name="status" className="select">
                                                <option disabled={true}>Status</option>
                                                <option value={"ongoing"}>Ongoing</option>
                                                <option value={"closed"}>Closed</option>
                                                {/* <option>Velvet</option> */}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        {/* Username Field */}
                                        <div className="flex-1 pb-8">
                                            <label className="input validator w-full">

                                                <input
                                                    type="text"
                                                    required
                                                    name="qualification"
                                                    placeholder="Qualification"
                                                    className="w-full"
                                                />
                                            </label>
                                        </div>

                                    </div>

                                    <div className="pb-8">
                                        <textarea className="textarea w-full" name="responsibility" placeholder="responsibility"></textarea>
                                    </div>

                                    <div className="flex-1 pb-8">
                                        <textarea className="textarea w-full" name="description" placeholder="description"></textarea>

                                    </div>
                                    <div>
                                        <button className='btn btn-primary'>
                                            Add Job
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>
                <table className="table">

                    <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <th>Job Title</th>
                            <th>Applicants</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Render active jobs */}
                        {actJobs.length > 0 ? (
                            actJobs.map((job, idx) => (
                                <tr key={job._id || idx}>
                                    <th>
                                        <label>
                                            <input type="checkbox" className="checkbox" />
                                        </label>
                                    </th>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            {job.jobTitle}
                                            {/* {job._id} */}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {/* Replace with actual applicants count if available */}
                                            {job.applicantsCount || 0} applied
                                        </div>
                                    </td>
                                    <td>
                                        <p>{job.status}</p>
                                    </td>
                                    <th>
                                        {/* Format deadline if needed */}
                                        {job.deadline}
                                    </th>
                                    <th>
                                        <Link to={`/recruiter/dashboard/summary-cards/active-job/${job?._id}`}>
                                            <p className="link link-primary">View Details</p>
                                        </Link>
                                    </th>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center py-4">No active jobs found.</td>
                            </tr>
                        )}
                    </tbody>
                    {/* foot */}

                </table>
            </div>

        </div>
    )
}

export default ActiveJobsTable