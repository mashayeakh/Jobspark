import React from 'react'
import { IoMdAdd } from "react-icons/io";


const ActiveJobsTable = () => {
    return (
        <div>
            <div className="overflow-x-auto shadow-2xl rounded-4xl bg-white ">
                <div className='flex items-center justify-between mb-4 px-12 pt-4 '>
                    <p className='text-2xl text-green-800 font-bold'>Active Jobs
                        <span className='text-sm text-gray-500 badge-accent ml-2'> (Total: 100)</span>
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

                                <form method="dialog" className="max-w-4xl mx-auto pb-5 px-10">
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
                                                    name="comapny_name"
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
                                                <option>Crimson</option>
                                                <option>Amber</option>
                                                <option>Velvet</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        {/* Username Field */}
                                        <div className="flex-1 pb-8">
                                            <select defaultValue="Experience Level" name="exp_level" className="select">
                                                <option disabled={true}>Experience Level</option>
                                                <option>Mid</option>
                                                <option>Amber</option>
                                                <option>Velvet</option>
                                            </select>
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <select defaultValue="Experience Level" name="job_category" className="select">
                                                <option disabled={true}>Job Category</option>
                                                <option>Mid</option>
                                                <option>Amber</option>
                                                <option>Velvet</option>
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
                                                <option>Ongoing</option>
                                                <option>Closed</option>
                                                <option>Velvet</option>
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
                                        <textarea className="textarea w-full" name="describtion" placeholder="describtion"></textarea>

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