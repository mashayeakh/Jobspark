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
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [recommendedJobsLoading, setRecommendedJobsLoading] = useState(false);
    const [showAll, setShowAll] = useState(false); // ✅ NEW STATE
    const jobsPerPage = 3;

    useEffect(() => {
        setCurrentPage(1);
    }, [jobs]);

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

        const fetchSaved = async () => {
            const url = `http://localhost:5000/api/v1/user/${user?._id}/saved-jobs`;
            const res = await fetchingSavedJobs(url);
            if (res.success) {
                const jobIdList = res.data.map(job => job.jobId);
                setSavedNumJob(jobIdList);
            }
        };

        if (user?._id) {
            fetchAll();
            fetchSaved();
        }
    }, [user?._id]);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            try {
                setRecommendedJobsLoading(true);
                const res = await fetch(`http://localhost:5000/api/v1/ai/recommend-jobs/${user?._id}`);
                const data = await res.json();
                if (data.success) {
                    setRecommendedJobs(data.jobs);
                } else {
                    setRecommendedJobs([]);
                }
            } catch (err) {
                console.error("Failed to fetch recommended jobs", err);
                setRecommendedJobs([]);
            } finally {
                setRecommendedJobsLoading(false);
            }
        };

        if (user?._id && (!Array.isArray(jobs) || jobs.length === 0)) {
            fetchRecommendedJobs();
        }
    }, [jobs, user?._id]);

    const isRecommendedView =
        !showAll &&
        (Array.isArray(jobs) || jobs.length === 0) &&
        recommendedJobs.length > 0;

    const jobsToDisplay = (() => {
        if (Array.isArray(jobs) && jobs.length > 0) {
            return jobs; // Show searched jobs
        }
        if (!showAll && (!jobs || jobs.length === 0) && recommendedJobs.length > 0) {
            return recommendedJobs; // Show recommended jobs by default
        }
        return allJobs; // Show all active jobs
    })();


    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobsToDisplay.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobsToDisplay.length / jobsPerPage);

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

    const handleSaveBtn = async (e, userId, jobId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const url = `http://localhost:5000/api/v1/user/${userId}/save-jobs/${jobId}`;
            const response = await savingJobs(url, {});
            if (response.success) {
                setSavedNumJob(prev =>
                    prev.includes(jobId)
                        ? prev.filter(id => id !== jobId)
                        : [...prev, jobId]
                );
            }
        } catch (error) {
            console.error("Error saving job:", error);
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

    const renderJobCards = (jobsToRender) => (
        <div className="space-y-5 mt-6">
            {jobsToRender.map(showJobs => (
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
                                            >
                                                {savedNumJob.includes(showJobs?._id)
                                                    ? <FaBookmark className="w-5 h-5 fill-current" />
                                                    : <HiOutlineBookmark className="w-5 h-5 stroke-current" />}
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
    );

    const isLoading =
        recommendedJobsLoading ||
        ((!Array.isArray(jobs) || jobs.length === 0) &&
            recommendedJobs.length === 0 &&
            allJobs.length === 0);


    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {isLoading
                        ? "Loading jobs..."
                        : isRecommendedView
                            ? `Recommended Jobs for You (${jobsToDisplay.length} results)`
                            : `Available Jobs (${jobsToDisplay.length} results)`}
                </h2>

                {jobsToDisplay.length > 0 && (
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Page {currentPage} of {totalPages}
                    </div>
                )}
            </div>

            {(jobs || jobs.length === 0) && recommendedJobs.length > 0 && (
                <div className="mb-6 text-right">
                    <button
                        onClick={() => setShowAll(prev => !prev)}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        {showAll ? "← Back to Recommended Jobs" : "View All Active Jobs →"}
                    </button>
                </div>
            )}



            {recommendedJobsLoading ? (
                <div className="text-center text-gray-500 py-8">Loading recommended jobs...</div>
            ) : jobsToDisplay.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Try adjusting your search filters</p>
                </div>
            ) : (
                <>
                    {renderJobCards(currentJobs)}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center gap-1">
                                <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 border border-gray-300 rounded-l-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i} onClick={() => handlePageChange(i + 1)} className={`px-4 py-2 border-t border-b border-gray-300 w-10 ${currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                                        {i + 1}
                                    </button>
                                ))}
                                <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 border border-gray-300 rounded-r-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobLayout;
