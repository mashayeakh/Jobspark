import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import saveIcon from "../../../../../assets/imgs/icons/save-instagram.png"
import { HiOutlineLocationMarker, HiOutlineBookmark } from 'react-icons/hi';
import { FaBookmark } from "react-icons/fa";
import { ActiveJobsContext } from '../../../../Context/ActiveJobsContextProvider';
import { AuthContext } from '../../../../Context/AuthContextProvider';
import { Link } from 'react-router';
const Filterbar = () => {

    const { user } = useContext(AuthContext);
    const { fetchingSavedJobs } = useContext(ActiveJobsContext);
    const [num, setNum] = useState([]);

    useEffect(() => {
        if (!user?._id) return;

        const fetch = async () => {
            const url = `http://localhost:5000/api/v1/user/${user._id}/saved-jobs`;
            const res = await fetchingSavedJobs(url);
            if (res.success === true) {
                // const jobIds = res.data.map(job => job.jobId); // 👈 Extract only job IDs
                setNum(res);
            } else {
                console.log("Err ", res.message);
            }
        };

        fetch();
    }, [user?._id]);



    console.log("Num ====", num);


    return (

        <>
            <div>

            </div>
            <div className="max-w-md mx-auto">
                <div className='flex justify-between items-center px-4 pb-4'>
                    <p className='text-xl font-semibold text-gray-800'>Filter Jobs</p>
                    <button className='cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-base transition-colors'>
                        Clear All
                    </button>
                </div>

                <div className='w-full p-6 border border-gray-200 rounded-xl bg-white shadow-sm'>
                    {/* Experience Level Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                            <p className="text-lg font-semibold text-gray-700">Experience Level</p>
                            <IoIosArrowDown size={18} className="text-gray-500" />
                        </div>

                        <div className='space-y-2 pl-2'>
                            {['Any', 'Entry Level', 'Intermediate', 'Senior', 'Expert'].map((level) => (
                                <label key={level} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked={level === 'Any'}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{level}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='border-t border-gray-200 my-4'></div>

                    {/* Job Type Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                            <p className="text-lg font-semibold text-gray-700">Job Type</p>
                            <IoIosArrowDown size={18} className="text-gray-500" />
                        </div>

                        <div className='space-y-2 pl-2'>
                            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => (
                                <label key={type} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked={type === 'Full-time'}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='border-t border-gray-200 my-4'></div>

                    {/* Job Functions Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                            <p className="text-lg font-semibold text-gray-700">Job Functions</p>
                            <IoIosArrowDown size={18} className="text-gray-500" />
                        </div>

                        <div className='space-y-2 pl-2'>
                            {['Engineering', 'Design', 'Marketing', 'Sales', 'Finance'].map((func) => (
                                <label key={func} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        defaultChecked={func === 'Engineering'}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{func}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='border-t border-gray-200 my-4'></div>

                    {/* Saved Jobs Section */}
                    <div className='flex justify-between items-center p-2 rounded-lg hover:bg-gray-50'>
                        <div>
                            <p className='text-lg font-semibold text-gray-700'>Saved Jobs
                                <span className='text-gray-500 text-lg ml-2'>
                                    ({num?.count})
                                </span>
                            </p>
                            <p className='text-sm text-gray-500'>View your saved positions</p>
                        </div>

                        <Link to="/saved-jobs">
                            <button className="p-2 rounded-full transition-colors cursor-pointer">
                                {num?.count > 0 ? (
                                    <FaBookmark className="w-5 h-5 text-black" />
                                ) : (
                                    <HiOutlineBookmark className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                                )}
                            </button>
                        </Link>


                    </div>
                </div>
            </div>
        </>
    )
}

export default Filterbar    