import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { getMethod } from '../../Utils/Api';

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
        <div className="px-10 py-8">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            {loading ? (
                <p>Loading...</p>
            ) : jobs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job._id} className="card bg-base-100 shadow-md border">
                            <div className="card-body">
                                <h2 className="card-title">{job.jobTitle}</h2>
                                <p>{job.companyName}</p>
                                <p>{job.location}</p>
                                <div className="card-actions justify-end">
                                    <p className="badge badge-primary">{job.jobCategory}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No jobs found matching your criteria.</p>
            )}
        </div>
    );
};

export default SearchResults;
