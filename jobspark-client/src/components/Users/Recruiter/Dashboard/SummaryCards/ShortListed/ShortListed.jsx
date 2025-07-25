import React, { useContext, useEffect, useState } from 'react';
import { FaSort, FaSearch, FaCalendarAlt, FaUniversity, FaCode, FaBriefcase, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { TotalApplicationContext } from './../../../../../Context/TotalApplicationProvider';
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShortListed = () => {
    const { getShortlistedApplicants, sendSchedule } = useContext(TotalApplicationContext);
    const { user } = useContext(AuthContext);
    const [shortlistedApplicant, setShortlistedApplicant] = useState({});
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [disabledApplicantIds, setDisabledApplicantIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isScheduling, setIsScheduling] = useState(false);

    const recruiterId = user?._id;

    const showShortlistedApplicants = async () => {
        setIsLoading(true);
        try {
            const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/shortlisted-Candidates`;
            const response = await getShortlistedApplicants(url);
            if (response.status === true) {
                setShortlistedApplicant(response);
            }
        } catch (err) {
            console.error("Error fetching shortlisted applicants:", err.message);
            toast.error('Failed to load applicants');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!recruiterId) return;
        showShortlistedApplicants();
    }, [recruiterId]);

    const sendingSchedule = async (e) => {
        e.preventDefault();
        setIsScheduling(true);

        const data = {
            recruiter: e.target.recruiter_id.value.trim(),
            applicant: e.target.applicantId.value.trim(),
            job: e.target.jobId.value.trim(),
            dateTime: new Date(e.target.dateTime.value).toISOString(),
            interviewType: e.target.interviewType.value.trim(),
            notes: e.target.notes.value.trim(),
        };

        const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/interviews/schedule`;

        try {
            const response = await sendSchedule(url, data);
            if (response.status === true || response.message === "Interview Scheduled Successfully") {
                setDisabledApplicantIds(prev => [...prev, data.applicant.trim()]);
                e.target.reset();
                document.getElementById('my_modal_5').close();
                toast.success('Interview scheduled successfully!');
            } else {
                toast.error(response.message || "Failed to schedule interview");
            }
        } catch (error) {
            console.error("Error scheduling interview:", error);
            toast.error(error.response?.data?.message || "Interview already scheduled for this applicant and job.");
        } finally {
            setIsScheduling(false);
        }
    };

    useEffect(() => {
        const fetchScheduledApplicants = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/v1/recruiter/${recruiterId}/interviews/scheduled-applicants`);
                const data = await res.json();
                if (data.status) {
                    setDisabledApplicantIds(data.applicantIds);
                }
            } catch (err) {
                console.error("Error fetching scheduled applicants", err);
            }
        };
        fetchScheduledApplicants();
    }, [recruiterId]);

    const filteredApplicants = shortlistedApplicant.data?.filter(applicant =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="p-4 md:p-6"
        >
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Shortlisted Applicants</h1>
                <p className="text-gray-600">Manage and schedule interviews with your top candidates</p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="relative flex-grow max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search applicants by name, email or job title..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label htmlFor="filter" className="text-gray-600 font-medium">Filter:</label>
                        <select className="select select-bordered select-sm w-32">
                            <option>All</option>
                            <option>Recent</option>
                            <option>By Skill</option>
                        </select>
                    </div>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-sm btn-ghost rounded-lg flex items-center gap-2">
                            <FaSort size={14} />
                            <span>Sort</span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                            <li><a>Newest First</a></li>
                            <li><a>Oldest First</a></li>
                            <li><a>By Experience</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Applicants Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredApplicants?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200">
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Education</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Job</th>
                                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredApplicants.map((applicant, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <FaUserTie className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                            <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                                                {applicant.email}
                                            </a>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FaUniversity className="mr-2 text-gray-400" />
                                                {applicant.university || 'Not specified'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FaCode className="mr-2 text-gray-400" />
                                                {applicant.skills || '-'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FaBriefcase className="mr-2 text-gray-400" />
                                                {applicant.experienceLevel || 'Entry level'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                                            {applicant.jobTitle}
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className={`btn btn-sm ${disabledApplicantIds?.includes(applicant.applicantId?.toString().trim())
                                                    ? 'btn-disabled bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'btn-primary hover:bg-blue-600 shadow-md'}`}
                                                disabled={disabledApplicantIds?.includes(applicant.applicantId?.toString().trim())}
                                                onClick={() => {
                                                    if (disabledApplicantIds?.includes(applicant.applicantId?.toString().trim())) return;
                                                    setSelectedApplicant(applicant);
                                                    document.getElementById('my_modal_5').showModal();
                                                }}
                                            >
                                                {disabledApplicantIds?.includes(applicant.applicantId?.toString().trim())
                                                    ? 'Scheduled'
                                                    : 'Schedule'}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center p-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No shortlisted applicants found</h3>
                        <p className="text-gray-500">When you shortlist candidates, they will appear here.</p>
                    </div>
                )}
            </div>

            {/* Schedule Interview Modal */}
            <dialog id="my_modal_5" className="modal backdrop-blur-sm">
                <div className="modal-box max-w-2xl bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <div>
                            <h3 className="font-bold text-2xl text-gray-800">Schedule Interview</h3>
                            <p className="text-sm text-gray-500 mt-1">Set up meeting details for {selectedApplicant?.name || 'the candidate'}</p>
                        </div>
                        <form method="dialog">
                            <button
                                className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                                disabled={isScheduling}
                            >
                                ✕
                            </button>
                        </form>
                    </div>

                    <form onSubmit={sendingSchedule} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Recruiter ID */}
                            <div className="space-y-2">
                                <label className="block">
                                    <span className="label-text font-medium text-gray-700">Recruiter ID</span>
                                </label>
                                <input
                                    name="recruiter_id"
                                    type="text"
                                    className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    defaultValue={recruiterId}
                                    required
                                    readOnly
                                />
                            </div>

                            {/* Job ID */}
                            <div className="space-y-2">
                                <label className="block">
                                    <span className="label-text font-medium text-gray-700">Job ID</span>
                                </label>
                                <input
                                    name="jobId"
                                    defaultValue={selectedApplicant?.jobId}
                                    type="text"
                                    className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                    readOnly
                                />
                            </div>

                            {/* Applicant ID */}
                            <div className="space-y-2">
                                <label className="block">
                                    <span className="label-text font-medium text-gray-700">Applicant ID</span>
                                </label>
                                <input
                                    name="applicantId"
                                    defaultValue={selectedApplicant?.applicantId}
                                    type="text"
                                    className="input input-bordered w-full bg-gray-50 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                    readOnly
                                />
                            </div>

                            {/* Interview Type */}
                            <div className="space-y-2">
                                <label className="block">
                                    <span className="label-text font-medium text-gray-700">Interview Type</span>
                                </label>
                                <select
                                    name="interviewType"
                                    className="select select-bordered w-full bg-gray-50 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                >
                                    <option value="">Select interview type</option>
                                    <option value="Google Meet">Google Meet (Online)</option>
                                    <option value="Zoom">Zoom (Online)</option>
                                    <option value="In-Person">In-Person</option>
                                </select>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="space-y-2">
                            <label className="block">
                                <span className="label-text font-medium text-gray-700">Date & Time</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="dateTime"
                                    type="datetime-local"
                                    className="input input-bordered w-full pl-10 bg-gray-50 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    required
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="block">
                                <span className="label-text font-medium text-gray-700">Notes (optional)</span>
                            </label>
                            <textarea
                                name="notes"
                                className="textarea textarea-bordered w-full bg-gray-50 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                placeholder="Add meeting link, agenda, or special instructions..."
                                rows={3}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="modal-action pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="btn btn-ghost border border-gray-300 hover:bg-gray-100 text-gray-700"
                                onClick={() => document.getElementById('my_modal_5').close()}
                                disabled={isScheduling}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary shadow-md hover:shadow-lg transition-all relative"
                                disabled={isScheduling}
                            >
                                {isScheduling ? (
                                    <>
                                        <span className="opacity-0">Send Schedule</span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Send Schedule
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </motion.div>
    );
};

export default ShortListed;