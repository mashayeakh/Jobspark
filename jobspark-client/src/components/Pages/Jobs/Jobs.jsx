import { FaChessKing, FaSearch } from 'react-icons/fa';
import Filterbar from './shared/Filterbar/Filterbar';
import JobLayout from './shared/JobLayout/JobLayout';
import { useContext, useEffect, useState } from 'react';
import { ActiveJobsContext } from '../../Context/ActiveJobsContextProvider';
import { AuthContext } from '../../Context/AuthContextProvider';

const Jobs = () => {
    const { filteredJobs } = useContext(ActiveJobsContext);
    const { user } = useContext(AuthContext);

    const [filter, setFilter] = useState({
        jobType: '',
        location: '',
        minSalary: '',
        maxSalary: ''
    });

    const [fJobs, setFJobs] = useState([]);

    const fetchFilteredJobs = async () => {
        let url = `http://localhost:5000/api/v1/search/jobs`;
        const params = new URLSearchParams();

        if (filter.jobType) params.append("jobType", filter.jobType);
        if (filter.location) params.append("location", filter.location);
        if (filter.minSalary) params.append("minSalary", filter.minSalary);
        if (filter.maxSalary) params.append("maxSalary", filter.maxSalary);

        if ([...params].length > 0) {
            url += `?${params.toString()}`;
        }

        try {
            const response = await filteredJobs(url); // returns { success, data }
            setFJobs(response.data || []);            // ✅ FIXED HERE
            console.log("SETF ", response.data);      // ✅ Optional debug
        } catch (error) {
            console.error("Error fetching filtered jobs:", error);
        }
    };


    // You can auto-fetch for logged-in users on mount (optional)
    useEffect(() => {
        if (user?._id) {
            fetchFilteredJobs();
        }
    }, [user?._id]);

    const handleSearch = () => {
        fetchFilteredJobs();
    };

    return (
        <div>
            {/* Search Filters */}
            <div className='rounded-2xl p-4'>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
                        {/* Job Type */}
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                Job Type
                            </label>
                            <select
                                className="w-full select select-bordered bg-gray-50 border-gray-300 rounded-lg py-2 px-3 text-gray-700"
                                value={filter.jobType}
                                onChange={(e) => setFilter(prev => ({ ...prev, jobType: e.target.value }))}
                            >
                                <option value="">All</option>
                                <option value="Full time">Full time</option>
                                <option value="Part time">Part time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                Location
                            </label>
                            <select
                                className="w-full select select-bordered bg-gray-50 border-gray-300 rounded-lg py-2 px-3 text-gray-700"
                                value={filter.location}
                                onChange={(e) => setFilter(prev => ({ ...prev, location: e.target.value }))}
                            >
                                <option value="">All</option>
                                <option value="Dhaka, Bangladesh">Dhaka</option>
                                <option value="Rajshahi, Bangladesh">Rajshahi</option>
                                <option value="Lahore">Lahore</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        {/* Salary */}
                        <div className="flex-1 min-w-[180px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                Salary Range
                            </label>
                            <select
                                className="w-full select select-bordered bg-gray-50 border-gray-300 rounded-lg py-2 px-3 text-gray-700"
                                value={`${filter.minSalary}-${filter.maxSalary}`}
                                onChange={(e) => {
                                    const [min, max] = e.target.value.split('-');
                                    setFilter(prev => ({
                                        ...prev,
                                        minSalary: min,
                                        maxSalary: max
                                    }));
                                }}
                            >
                                <option value="-">All</option>
                                <option value="1000-3000">$1k - $3k</option>
                                <option value="3001-6000">$3k - $6k</option>
                                <option value="6001-10000">$6k - $10k</option>
                                <option value="10001-20000">$10k - $20k</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="mt-2 sm:mt-4">
                        <button
                            onClick={handleSearch}
                            className="flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            <FaSearch size={18} className="mr-2" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Job layout + Filter bar */}
            <div className="flex flex-col md:flex-row px-4 md:px-24 py-6 gap-6">
                <div className="w-72">
                    <Filterbar />
                </div>
                <div className="flex-1 px-4">
                    <JobLayout jobs={fJobs} />
                </div>
            </div>
        </div>
    );
};

export default Jobs;
