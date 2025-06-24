import React, { useContext, useEffect, useState } from 'react'
import { useLoaderData } from 'react-router'
import Google from '../../assets/imgs/companyLogo/google.png';
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";
import { AuthContext } from '../Context/AuthContextProvider';
import { CompanyContext } from '../Context/CompanyContextProvider';



const CompanyDetails = () => {


    const data = useLoaderData();
    console.log("DATA", data);

    const item = data?.data;

    const tabSections = [
        { key: "Home", label: "Home" },
        { key: "About", label: "About" },
        { key: "Jobs", label: "Job" },
        // { key: "", label: "Social & Media Links" },
    ];

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const activeTab = tabSections[activeTabIndex].key;

    const { singleCompanyInfoWithJobs } = useContext(CompanyContext);
    const [jobs, setJobs] = useState([]);

    const recruiterId = item?.recruiter;
    console.log("REcuirter uid", recruiterId);

    const fetchCompanyJobs = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${recruiterId}/company/${item?._id}`;
        const resposne = await singleCompanyInfoWithJobs(url);
        setJobs(resposne);
        console.log("Response check = ", resposne);
    }


    useEffect(() => {
        fetchCompanyJobs();
    }, [recruiterId, item?._id]);

    console.log("JOBS ", jobs);
    console.log("JOBS ", jobs.jobCount);



    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Company Cover & Info */}
            <div className='flex'>
                <div className='flex-[3]'>
                    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Cover Image */}
                            <div className="relative h-48 md:h-64 bg-gray-200">
                                <img
                                    src="https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg"
                                    alt="Company Cover"
                                    className="w-full h-full object-cover object-center"
                                />
                                <img
                                    src={item.logo || Google}
                                    alt="Company Logo"
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white absolute left-8 -bottom-12 bg-white p-2 shadow-lg"
                                />
                            </div>
                            {/* Main Info */}
                            <div className="pt-16 px-8">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h1 className="text-3xl font-bold uppercase">{item.companyName}</h1>
                                        <p className="text-gray-600 mt-1">{item.tagline}</p>
                                        <div className="flex flex-wrap gap-4 text-gray-700 text-sm mt-2">
                                            <div><strong>Industry:</strong> {item.industry}</div>
                                            <div><strong>Location:</strong> {item.headquarters}</div>
                                            <div><strong>Founded:</strong> {item.foundedYear}</div>
                                            <div><strong>Size:</strong> {item.companySize} employees</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 md:mt-0">
                                        <button className="btn btn-primary rounded-2xl flex items-center gap-2">
                                            Bookmark <FaRegBookmark />
                                        </button>
                                        <button className="btn btn-outline btn-primary rounded-2xl flex items-center gap-2">
                                            Visit Website <MdArrowOutward size={20} />
                                        </button>
                                    </div>
                                </div>
                                {/* Tabs */}
                            </div>
                            <div className="mt-8">
                                <ul className="flex space-x-8 px-8">
                                    {tabSections.map((tab, index) => (
                                        <li
                                            key={tab.key}
                                            onClick={() => setActiveTabIndex(index)}
                                            className={`cursor-pointer pb-2 font-medium transition-all ${activeTabIndex === index
                                                ? "text-primary border-b-2 border-primary"
                                                : "text-gray-400 hover:text-primary"
                                                }`}
                                        >
                                            {tab.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* Tab Content */}
                        <div className="mt-6">
                            {activeTab === "Home" && (
                                <div className="text-gray-700">
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2">
                                            <div className="bg-white rounded-lg shadow-sm p-6">
                                                <strong>Description:</strong>
                                                <p className="mt-2 text-gray-700">{item.description || "No description provided."}</p>
                                                <div className='flex justify-center mt-4 cursor-pointer'>
                                                    <button className="btn">See more</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="bg-white rounded-lg shadow-sm p-6">
                                                <strong>Contact & Info</strong>
                                                <ul className="mt-2 text-gray-700 text-sm space-y-1">
                                                    <li><strong>Email:</strong> {item.email || "N/A"}</li>
                                                    <li><strong>Website:</strong> {item.website || "N/A"}</li>
                                                    <li><strong>Phone:</strong> {item.phone || "N/A"}</li>
                                                    <li><strong>Address:</strong> {item.headquarters || "N/A"}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab === "About" && (
                                <div>
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden flex items-center">
                                        <div>

                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Overview</h3>
                                                {/* <p className="text-gray-700">{item.companyValues || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Website</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Industry</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Company Size</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">HeadQuaters</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Founded year</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <p className="text-gray-700">{item.companyValues || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <p className="text-gray-700">{item.companyValues || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <p className="text-gray-700">{item.companyValues || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <p className="text-gray-700">{item.companyValues || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <p className="text-gray-700">{item.companyValues || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <p className="text-gray-700">{item.companyValues || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5 shadow-sm ">
                                                <p className="text-gray-700">{item.companyValues || "No description available."}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === "Jobs" && (
                                <div>
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <strong className="block mb-2">Open Positions</strong>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {jobs?.jobs?.length ? (
                                                jobs.jobs.map((j, idx) => (
                                                    <div key={j._id || idx} className="card bg-base-100 shadow-sm ">
                                                        <div className="flex items-center gap-4 p-4">
                                                            <img
                                                                src={item.logo || Google}
                                                                alt="Job"
                                                                className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                                                            />
                                                            <div>
                                                                <h2 className="font-semibold text-lg">{j.title}</h2>
                                                                <p className="text-gray-500 text-sm">{j.location}</p>
                                                            </div>
                                                        </div>
                                                        <div className="px-4 pb-4">
                                                            <p className="text-gray-600 text-sm line-clamp-2">{j.description}</p>
                                                            <div className="card-actions mt-2">
                                                                <button className="btn btn-primary btn-sm">View Details</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-gray-400">No jobs posted yet.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                    </div>
                </div>
                <div className='flex-[1]'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit corrupti labore similique culpa enim eaque repudiandae recusandae molestias vitae necessitatibus, dolorum, provident quo, laudantium cumque at. Culpa esse ipsam possimus.
                </div>
            </div>

        </div>
    );
}

export default CompanyDetails