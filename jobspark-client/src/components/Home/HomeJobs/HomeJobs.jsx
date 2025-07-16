import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { BsFire } from "react-icons/bs";
import Google from '../../../assets/imgs/companyLogo/google.png';
import newIcon from '../../../assets/imgs/icons/new.png';
import { BiGame } from 'react-icons/bi';
import { FaLocationDot } from 'react-icons/fa6';
import { AiOutlineDollar } from 'react-icons/ai';
import { ActiveJobsContext } from '../../Context/ActiveJobsContextProvider';
import { useNavigate } from 'react-router';

const HomeJobs = () => {
    const [activeTab, setActiveTab] = useState("hot");
    const [jobs, setJobs] = useState([
        {
            id: 1,
            title: "Senior Software Engineer",
            company: "Google",
            logo: Google,
            description: "Develop cutting-edge web applications using React and Node.js",
            type: "Full time",
            location: "Remote",
            salary: "$120,000 - $150,000",
            isHot: true,
            isNew: false,
            isFavorite: false
        },
        {
            id: 2,
            title: "Frontend Developer",
            company: "Google",
            logo: Google,
            description: "Build responsive user interfaces with modern JavaScript frameworks",
            type: "Full time",
            location: "New York, NY",
            salary: "$100,000 - $130,000",
            isHot: false,
            isNew: true,
            isFavorite: false
        },
        {
            id: 3,
            title: "Backend Engineer",
            company: "Google",
            logo: Google,
            description: "Design and implement scalable microservices architecture",
            type: "Contract",
            location: "Remote",
            salary: "$90 - $120/hr",
            isHot: true,
            isNew: false,
            isFavorite: false
        },
        {
            id: 4,
            title: "DevOps Specialist",
            company: "Google",
            logo: Google,
            description: "Implement CI/CD pipelines and cloud infrastructure",
            type: "Full time",
            location: "San Francisco, CA",
            salary: "$110,000 - $140,000",
            isHot: false,
            isNew: true,
            isFavorite: false
        },
        {
            id: 5,
            title: "UX Designer",
            company: "Google",
            logo: Google,
            description: "Create intuitive user experiences for enterprise applications",
            type: "Part time",
            location: "Remote",
            salary: "$80 - $100/hr",
            isHot: false,
            isNew: false,
            isFavorite: false
        },
        {
            id: 6,
            title: "Data Scientist",
            company: "Google",
            logo: Google,
            description: "Analyze large datasets and build machine learning models",
            type: "Full time",
            location: "Boston, MA",
            salary: "$130,000 - $160,000",
            isHot: true,
            isNew: false,
            isFavorite: false
        }
    ]);

    const { fetchHotJobs, hotJobs } = useContext(ActiveJobsContext);

    useEffect(() => {
        const fetch = async () => {
            const url = `http://localhost:5000/api/v1/hotJobs`;
            await fetchHotJobs(url); // no need to set local state
        };
        fetch();
        console.log("HOT JOBS: ", hotJobs?.data); // works without loop
    }, [fetchHotJobs]);




    const toggleFavorite = (id) => {
        setJobs(jobs.map(job =>
            job.id === id ? { ...job, isFavorite: !job.isFavorite } : job
        ));
    };

    const handleHotJobs = useCallback((e) => {
        e.preventDefault();
        setActiveTab("hot");
    }, []);

    const handleRecentlyAddedJobs = (e) => {
        e.preventDefault();
        setActiveTab("recent");
    };

    const filteredJobs = activeTab === "hot"
        ? hotJobs?.data || []
        : jobs.filter(job => job.isNew);

    const getBadgeColor = (type) => {
        switch (type) {
            case 'full time': return 'bg-green-100 text-green-800';
            case 'part time': return 'bg-blue-100 text-blue-800';
            case 'contract': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // const navigate = useNavigate();
    // const handleJobs = () => {
    //     navigate("/jobs");
    // }

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Find Your Dream Job
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Browse through our latest job openings and kickstart your career
                    </p>
                </div>

                <div className="flex flex-col items-center mb-12">
                    <div className="inline-flex rounded-md shadow-sm bg-white p-1 border border-gray-200">
                        <button
                            onClick={handleHotJobs}
                            className={`px-6 py-3 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 transition-all duration-200 ${activeTab === "hot"
                                ? "bg-blue-600 text-white shadow-lg"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <div className="flex items-center">
                                <BsFire className="mr-2" />
                                Hot Jobs
                            </div>
                        </button>
                        <button
                            onClick={handleRecentlyAddedJobs}
                            className={`px-6 py-3 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 transition-all duration-200 ${activeTab === "recent"
                                ? "bg-green-600 text-white shadow-lg"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <div className="flex items-center">
                                <img src={newIcon} alt="New" className="w-4 h-4 mr-2" />
                                Recent Jobs
                            </div>
                        </button>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(job.type)}`}>
                                        {job.type}
                                    </span>
                                    <button
                                        onClick={() => toggleFavorite(job.id)}
                                        className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200"
                                    >
                                        {job.isFavorite ? (
                                            <FaHeart className="text-red-500" size={20} />
                                        ) : (
                                            <FaRegHeart size={20} />
                                        )}
                                    </button>
                                </div>

                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-20 h-20 mb-4 rounded-full bg-white p-2 shadow-md flex items-center justify-center">
                                        <img
                                            src={job.logo}
                                            alt={job.company}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 text-center">{job.title}</h3>
                                    <p className="text-gray-500 text-sm mt-1">{job.company}</p>
                                </div>

                                <p className="text-gray-600 mb-6 line-clamp-2">{job.description}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <FaLocationDot className="mr-1 text-blue-500" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <AiOutlineDollar className="mr-1 text-green-500" />
                                        {job.salary}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                                        Apply Now
                                    </button>
                                    {hotJobs?.data && (
                                        <div className="flex items-center text-red-500 text-sm">
                                            <BsFire className="mr-1" />
                                            Trending
                                        </div>
                                    )}
                                    {job.isNew && (
                                        <div className="flex items-center text-green-500 text-sm">
                                            <img src={newIcon} alt="New" className="w-4 h-4 mr-1" />
                                            New
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                        <BiGame className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
                        <p className="mt-1 text-gray-500">
                            {activeTab === "hot"
                                ? "There are currently no hot jobs available."
                                : "No recent jobs have been added yet."}
                        </p>
                    </div>
                )}

                {/* {filteredJobs.length > 0 && (
                    <div className="mt-12 text-center">
                        <button onClick={handleJobs} className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                            View All Jobs
                        </button>
                    </div>
                )} */}
            </div>
        </div>
    )
}


export default HomeJobs