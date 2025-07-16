import React, { useContext, useEffect, useState } from 'react';
import { ActiveJobsContext } from '../../../../Context/ActiveJobsContextProvider';
import { AuthContext } from '../../../../Context/AuthContextProvider';
import { HiOutlineLocationMarker, HiOutlineBookmark } from 'react-icons/hi';
import { FaBookmark } from "react-icons/fa";
import { FiClock, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router';
import { BsThreeDotsVertical } from 'react-icons/bs';

const JobLayout = ({ jobs }) => {
    const { fetchAllActiveJobs, fetchingSavedJobs, savingJobs } = useContext(ActiveJobsContext);
    const { user } = useContext(AuthContext);
    const [allJobs, setAllJobs] = useState([]);
    const [savedNumJob, setSavedNumJob] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 3;

    useEffect(() => {
        setCurrentPage(1); // Reset page on job change
    }, [jobs]);

    const fetchedSavedNum = async () => {
        const url = `http://localhost:5000/api/v1/user/${user?._id}/saved-jobs`;
        const res = await fetchingSavedJobs(url);
        if (res.success) {
            const jobIdList = res.data.map(job => job.jobId);
            setSavedNumJob(jobIdList);
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const url = "http://localhost:5000/api/v1/";
                const res = await fetchAllActiveJobs(url);
                setAllJobs(res.data || []);
            } catch (err) {
                console.log("Error loading jobs:", err.message);
            }
        };

        if (user?._id) {
            fetchAll();
            fetchedSavedNum();
        }
    }, [user?._id]);

    // Final job list to display
    const displayedJobs =
        Array.isArray(jobs) && jobs.length > 0
            ? jobs
            : Array.isArray(jobs) && jobs.length === 0
                ? [] // Show "No jobs found"
                : allJobs;

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = displayedJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(displayedJobs.length / jobsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getEmploymentTypeBadge = (type) => {
        const badgeClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

        switch (type) {
            case "Full time":
                return <span className={`${badgeClasses} bg-blue-100 text-blue-800`}><FiClock className="mr-1" /> Full time</span>;
            case "Part time":
                return <span className={`${badgeClasses} bg-purple-100 text-purple-800`}><FiClock className="mr-1" /> Part time</span>;
            default:
                return <span className={`${badgeClasses} bg-yellow-100 text-yellow-800`}><FiClock className="mr-1" /> Internship</span>;
        }
    };

    const handleSaveBtn = async (e, userId, jobId) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const url = `http://localhost:5000/api/v1/user/${userId}/save-jobs/${jobId}`;
            const response = await savingJobs(url, {});

            if (response.success) {
                if (savedNumJob.includes(jobId)) {
                    setSavedNumJob(prev => prev.filter(id => id !== jobId));
                } else {
                    setSavedNumJob(prev => [...prev, jobId]);
                }
            }
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Available Jobs
                    <span className="text-gray-500 text-lg ml-2">
                        ({displayedJobs.length} results)
                    </span>
                </h2>
                {displayedJobs.length > 0 && (
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Page {currentPage} of {totalPages}
                    </div>
                )}
            </div>

            {displayedJobs.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Try adjusting your search filters or refresh recommendations</p>
                </div>
            ) : (
                <>
                    <div className="space-y-5">
                        {currentJobs.map(showJobs => (
                            <Link to={`/job/${showJobs?._id}`} key={showJobs?._id} className="block group">
                                <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:border-blue-300">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={showJobs.companyLogo || "https://via.placeholder.com/80x80?text=Company"}
                                                    alt="Company Logo"
                                                    className="rounded-lg w-14 h-14 md:w-16 md:h-16 object-contain border border-gray-200 bg-gray-100"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                                                            {showJobs?.jobTitle}
                                                        </h3>
                                                        <p className="text-gray-700 font-medium mb-2 truncate">
                                                            {showJobs?.companyName}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className={`p-2 rounded-full transition-colors ${savedNumJob.includes(showJobs?._id) ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'}`}
                                                            onClick={(e) => handleSaveBtn(e, user?._id, showJobs?._id)}
                                                            aria-label={savedNumJob.includes(showJobs?._id) ? "Unsave job" : "Save job"}
                                                        >
                                                            {savedNumJob.includes(showJobs?._id) ? (
                                                                <FaBookmark className="w-5 h-5 fill-current" />
                                                            ) : (
                                                                <HiOutlineBookmark className="w-5 h-5 stroke-current" />
                                                            )}
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                                            <BsThreeDotsVertical className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 mb-3">
                                                    <div className="flex items-center text-gray-600">
                                                        <HiOutlineLocationMarker className="mr-1.5 text-gray-500 flex-shrink-0" />
                                                        <span className="truncate">{showJobs?.location}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <FiDollarSign className="mr-1.5 text-gray-500 flex-shrink-0" />
                                                        <span>${showJobs?.salary?.toLocaleString()}</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 line-clamp-2 mb-4">
                                                    {showJobs?.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {getEmploymentTypeBadge(showJobs?.employeeType)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-1">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-l-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-4 py-2 border-t border-b border-gray-300 w-10 flex items-center justify-center ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-r-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobLayout;
