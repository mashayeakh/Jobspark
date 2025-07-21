import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import { postMethod } from "../../../../../Utils/Api";
import { ActiveJobsContext } from '../../../../../Context/ActiveJobsContextProvider';
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import jobCategories from '../../../../../../constants/JobCategories';
import toast from 'react-hot-toast';

const ActiveJobsTable = ({ sendJobsToParent }) => {
    const { user } = useContext(AuthContext);
    const recruiterId = user?._id;
    const { fetchRecruiterAllActiveJobs, downloadJobs } = useContext(ActiveJobsContext);
    const [actJobs, setActJobs] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?._id) fetchActiveJobs();
    }, [user?._id]);

    const fetchActiveJobs = async () => {
        try {
            const url = `http://localhost:5000/api/v1/activeJobs/${user._id}`;
            const data = await fetchRecruiterAllActiveJobs(url);
            if (data.success) {
                setActJobs(data.data);
                sendJobsToParent && sendJobsToParent(data.data);
            }
        } catch (err) {
            console.log("Err from Client - ", err.message);
        }
    };

    const handleAddJobs = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const addJobs = {
            recruiter: recruiterId,
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
        };

        try {
            const url = "http://localhost:5000/api/v1/job";
            const data = await postMethod(url, addJobs);
            console.log("DATA ", data);
            if (data.status === true) {
                toast.success(" Job Added Successfully");
                e.target.reset();
                document.getElementById('my_modal_1').close();

                // Small delay to allow modal to close before fetching data
                setTimeout(() => {
                    fetchActiveJobs();
                }, 300);
            }
        } catch (err) {
            console.error("Error while posting job:", err.message);
            toast.error("❌ Failed to add job. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'ongoing':
                return <span className="badge badge-success badge-lg px-3 py-2 rounded-full">Active</span>;
            case 'closed':
                return <span className="badge badge-error badge-lg px-3 py-2 rounded-full">Closed</span>;
            default:
                return <span className="badge badge-info badge-lg px-3 py-2 rounded-full">{status}</span>;
        }
    };

    const handleEx = () => {
        navigate("/recruiter/dashboard/summary-cards/expired-Jobs");
    };

    const [isDownloading, setIsDownloading] = useState(false);


    const handleDownloadCSV = (e) => {
        e.preventDefault();
        // console.log("Download triggered");
        // downloadJobs;

        setIsDownloading(true);

        const url = `http://localhost:5000/api/v1/export/recruiter/${user?._id}/active-jobs`;

        setTimeout(() => {
            window.location.href = url;
            //after downloading is done, 
            setIsDownloading(false);
        }, 900)

        // setIsDownloading(false);
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Active Jobs</h2>
                    <p className="text-gray-600 mt-1 text-sm font-medium">
                        {actJobs.length} {actJobs.length === 1 ? 'active listing' : 'active listings'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => document.getElementById('my_modal_1').showModal()}
                        className="btn btn-primary gap-2 px-6 hover:shadow-md transition-shadow duration-200"
                    >
                        <IoMdAdd size={20} /> Add New Job
                    </button>
                    <button
                        onClick={handleEx}
                        className="btn btn-outline btn-primary gap-2 px-6 hover:shadow-md transition-shadow duration-200"
                    >
                        View Expired Jobs
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        disabled={isDownloading}
                        className={`
                                btn bg-[#4c956c] gap-2 px-6 text-white 
                                relative overflow-hidden
                                transition-all duration-300
                                hover:shadow-lg
                                ${isDownloading ?
                                'cursor-wait opacity-90' :
                                'hover:scale-[1.02] active:scale-[0.98]'
                            }
                                `}
                    >
                        {isDownloading ? (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Downloading...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                </svg>
                                <span>Download CSV</span>
                            </div>
                        )}

                        {/* Animated background effect */}
                        {isDownloading && (
                            <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                        )}
                    </button>

                </div>
            </div>


            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="font-medium px-6 py-4">Job Title</th>
                            <th className="font-medium px-6 py-4">Applicants</th>
                            <th className="font-medium px-6 py-4">Status</th>
                            <th className="font-medium px-6 py-4">Deadline</th>
                            <th className="font-medium px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {actJobs.length > 0 ? actJobs.map((job) => (
                            <tr key={job._id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium text-gray-800">{job.jobTitle}</p>
                                            <p className="text-sm text-gray-500">{job.companyName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm font-medium">
                                        {job.applicantsCount || 0} applicants
                                    </span>
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700 font-medium">
                                        {new Date(job?.deadline).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric"
                                        })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                            to={`/recruiter/dashboard/summary-cards/active-job/${job?._id}`}
                                            className="btn btn-ghost btn-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full p-2"
                                        >
                                            <FiEye size={18} />
                                        </Link>
                                        <button className="btn btn-ghost btn-sm text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full p-2">
                                            <FiEdit2 size={18} />
                                        </button>
                                        <button className="btn btn-ghost btn-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full p-2">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No active jobs found</p>
                                        <button
                                            onClick={() => document.getElementById('my_modal_1').showModal()}
                                            className="btn btn-link text-primary hover:text-primary-focus font-medium"
                                        >
                                            Create your first job listing
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <dialog id="my_modal_1" className="modal backdrop-blur-sm">
                <div className="modal-box max-w-4xl bg-white shadow-xl p-8 rounded-lg border border-gray-200">
                    {/* <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                        ✕
                    </button> */}

                    <div className="space-y-1 mb-8">
                        <h3 className="font-bold text-2xl text-gray-800">Create New Job Posting</h3>
                        <p className="text-gray-500">Fill out the form to create a new job listing</p>
                    </div>

                    <form onSubmit={handleAddJobs} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Title */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Job Title*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    name="job_title"
                                    placeholder="e.g. Senior Frontend Developer"
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                                />
                            </div>

                            {/* Company Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Company Name*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    name="company_name"
                                    placeholder="Your company name"
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                                />
                            </div>

                            {/* Location */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Location*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    name="location"
                                    placeholder="e.g. Remote, New York, etc."
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                                />
                            </div>

                            {/* Employee Type */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Employment Type*</span>
                                </label>
                                <select
                                    name="emp_type"
                                    className="select select-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 text-gray-700 transition-all duration-200"
                                    required
                                >
                                    <option disabled selected value="">Select type</option>
                                    <option value="Full time">Full time</option>
                                    <option value="Part time">Part time</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Experience Level*</span>
                                </label>
                                <select
                                    name="exp_level"
                                    className="select select-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 text-gray-700 transition-all duration-200"
                                    required
                                >
                                    <option disabled selected value="">Select level</option>
                                    <option value="Entry">Entry Level</option>
                                    <option value="Mid">Mid Level</option>
                                    <option value="Senior">Senior Level</option>
                                </select>
                            </div>

                            {/* Job Category */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Job Category*</span>
                                </label>
                                <select
                                    name="job_category"
                                    className="select select-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 text-gray-700 transition-all duration-200"
                                    required
                                >
                                    <option disabled selected value="">Select category</option>
                                    {jobCategories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Skills */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Required Skills</span>
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    placeholder="e.g. React, Node.js, CSS"
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                                />
                            </div>

                            {/* Salary */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Salary*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        required
                                        name="salary"
                                        placeholder="Annual salary in USD"
                                        className="input input-bordered w-full pl-8 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                                    />
                                </div>
                            </div>

                            {/* Deadline */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Application Deadline*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    name="deadline"
                                    className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 text-gray-700 transition-all duration-200"
                                />
                            </div>

                            {/* Status */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Status*</span>
                                </label>
                                <select
                                    name="status"
                                    className="select select-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 text-gray-700 transition-all duration-200"
                                    required
                                >
                                    <option disabled selected value="">Select status</option>
                                    <option value="ongoing">Active</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                        </div>

                        {/* Qualification */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Qualifications*</span>
                            </label>
                            <input
                                type="text"
                                required
                                name="qualification"
                                placeholder="Required qualifications (e.g. Bachelor's degree in Computer Science)"
                                className="input input-bordered w-full bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                            />
                        </div>

                        {/* Responsibilities */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Responsibilities*</span>
                            </label>
                            <textarea
                                name="responsibility"
                                className="input input-bordered w-full h-28 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                                placeholder="List key responsibilities (separate with bullet points or commas)..."
                                required
                            ></textarea>
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-700">Job Description*</span>
                            </label>
                            <textarea
                                name="description"
                                className="input input-bordered w-full h-32 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-200 border-gray-200 focus:border-blue-300 transition-all duration-200"
                                placeholder="Detailed job description including company culture, benefits, etc..."
                                required
                            ></textarea>
                        </div>

                        <div className="modal-action pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => document.getElementById('my_modal_1').close()}
                                className="btn btn-ghost hover:bg-gray-100 text-gray-600 mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn bg-blue-600 text-white border-none px-8 transition-all duration-200 ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700 hover:shadow-md"
                                    }`}
                            >
                                {isSubmitting ? "Creating..." : "Create Job"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div >
    );
};

export default ActiveJobsTable;