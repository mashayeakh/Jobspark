import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router';
import { getMethod } from '../../Utils/Api';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const SearchResults = () => {
    const { search } = useLocation();
    const { keyword, location, category } = Object.fromEntries(new URLSearchParams(search));

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const url = `http://localhost:5000/api/v1/jobs/search?keyword=${keyword}&location=${location}&category=${category}`;
                const response = await getMethod(url);
                setJobs(response.data || []);
            } catch (error) {
                console.error("Error fetching search results", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [keyword, location, category]);

    return (
        <div className="px-6 py-10">
            <div className="px-3 pb-4">
                <p className="text-xl text-gray-700">
                    Showing Result: {jobs?.length}
                </p>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : jobs?.length > 0 ? (
                jobs.map((job) => (
                    <Link key={job._id} to={`/job/${job._id}`}>
                        <div className="w-full p-4 shadow-2xl bg-white border border-gray-200 rounded-lg sm:p-8 transition delay-150 duration-200 cursor-pointer mb-8">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 items-center">
                                    <figure>
                                        <img
                                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                            alt="Company Logo"
                                            className="rounded-xl w-24 h-20"
                                        />
                                    </figure>
                                    <div>
                                        <h5 className="mb-2 text-3xl font-bold">{job?.jobTitle}</h5>
                                        <div className="flex text-gray-600 text-lg gap-4">
                                            <p className="font-bold">{job?.companyName}</p>
                                            <p className="ml-2 flex items-center gap-1">
                                                <HiOutlineLocationMarker size={24} />
                                                {job?.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">${job?.salary}</p>
                                </div>
                            </div>

                            <div className="pt-8">
                                <p className="mb-5 text-base text-gray-500 sm:text-lg">
                                    {job?.description}
                                </p>
                                <div className="bg-white">
                                    {job?.employeeType === 'Full time' && (
                                        <div className="badge badge-primary badge-lg mr-4">Full time</div>
                                    )}
                                    {job?.employeeType === 'Part time' && (
                                        <div className="badge badge-secondary badge-lg mr-4">Part time</div>
                                    )}
                                    {job?.employeeType === 'Internship' && (
                                        <div className="badge badge-warning badge-lg mr-4">Internship</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div>
                    <p>No Jobs found</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
