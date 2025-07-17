import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import { ActiveJobsContext } from '../../../../../Context/ActiveJobsContextProvider';
import { Link } from 'react-router';
import { FiEye } from 'react-icons/fi';

const ExpiredJobs = () => {

    const { user } = useContext(AuthContext);
    // const { fetchEx, ex } = useContext(ActiveJobsContext);
    const [expiredJobs, setExpiredJobs] = useState([]);


    // console.log("EX====", ex);


    const fetchExpiredJobs = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/expiredJobs/${user._id}`);

            const data = await res.json();
            if (data.success) {
                setExpiredJobs(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch expired jobs:", err.message);
        }
    };

    // console.log("EX ", expiredJobs);

    useEffect(() => {
        if (user?._id) {
            fetchExpiredJobs();
        }
    }, [user?._id]);



    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-10">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Expired Jobs</h2>
                <p className="text-gray-500 mt-1">{expiredJobs.length} expired listings</p>
            </div>

            <div className="overflow-x-auto">
                <table className="table">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="font-medium">Job Title</th>
                            <th className="font-medium">Deadline</th>
                            <th className="font-medium">Status</th>
                            <th className="font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {expiredJobs.length > 0 ? (
                            expiredJobs.map((job) => (
                                <tr key={job._id} className="hover:bg-gray-50">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-medium text-gray-800">{job.jobTitle}</p>
                                                <p className="text-sm text-gray-500">{job.companyName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-sm text-gray-700">
                                            {new Date(job.deadline).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-error badge-lg">Expired</span>
                                    </td>
                                    <td className="text-right">
                                        <Link
                                            to={`/recruiter/dashboard/summary-cards/expired-job/${job._id}`}
                                            className="btn btn-ghost btn-sm text-gray-600 hover:text-blue-600"
                                        >
                                            <FiEye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    No expired jobs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default ExpiredJobs