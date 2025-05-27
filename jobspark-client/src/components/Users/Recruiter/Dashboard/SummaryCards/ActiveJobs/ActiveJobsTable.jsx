import React from 'react'
import { IoMdAdd } from "react-icons/io";


const ActiveJobsTable = () => {
    return (
        <div>
            <div className="overflow-x-auto shadow-2xl rounded-4xl bg-white ">
                <div className='flex items-center justify-between mb-4 px-12 pt-4'>
                    <p className='text-2xl text-green-800 font-bold'>Active Jobs
                        <span className='text-sm text-gray-500 badge-accent ml-2'> (Total: 100)</span>
                    </p>
                    <th>
                        <div>
                            <button className="btn btn-outline btn-primary btn-lg">
                                <IoMdAdd size={24} />  Add Jobs
                            </button>

                        </div>
                    </th>
                </div>
                <table className="table">
                    {/* head */}
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
                        {/* row 1 */}
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    UX/UI Designer
                                </div>
                            </td>
                            <td>
                                <div>

                                    193 applied
                                </div>
                            </td>
                            <td> <p>Ongoing</p></td>
                            <th>
                                21st march, 2025
                            </th>
                            <th>
                                View Details
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    UX/UI Designer
                                </div>
                            </td>
                            <td>
                                <div>

                                    193 applied
                                </div>
                            </td>
                            <td> <p>Ongoing</p></td>
                            <th>
                                21st march, 2025
                            </th>
                            <th>
                                View Details
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    UX/UI Designer
                                </div>
                            </td>
                            <td>
                                <div>

                                    193 applied
                                </div>
                            </td>
                            <td> <p>Ongoing</p></td>
                            <th>
                                21st march, 2025
                            </th>
                            <th>
                                View Details
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    UX/UI Designer
                                </div>
                            </td>
                            <td>
                                <div>

                                    193 applied
                                </div>
                            </td>
                            <td> <p>Ongoing</p></td>
                            <th>
                                21st march, 2025
                            </th>
                            <th>
                                View Details
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    UX/UI Designer
                                </div>
                            </td>
                            <td>
                                <div>
                                    193 applied
                                </div>
                            </td>
                            <td> <p>Ongoing</p></td>
                            <th>
                                21st march, 2025
                            </th>
                            <th>
                                View Details
                            </th>
                        </tr>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox" className="checkbox" />
                                </label>
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    UX/UI Designer
                                </div>
                            </td>
                            <td>
                                <div>

                                    193 applied
                                </div>
                            </td>
                            <td> <p>Ongoing</p></td>
                            <th>
                                21st march, 2025
                            </th>
                            <th>
                                View Details
                            </th>
                        </tr>
                    </tbody>
                    {/* foot */}

                </table>
            </div>

        </div>
    )
}

export default ActiveJobsTable