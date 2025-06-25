import React, { useContext, useEffect, useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import Google from '../../assets/imgs/companyLogo/google.png';
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";
import { AuthContext } from '../Context/AuthContextProvider';
import { CompanyContext } from '../Context/CompanyContextProvider';



const CompanyDetails = () => {


    const data = useLoaderData();
    console.log("DATA", data);

    const item = data?.data;

    console.log("Item =====", item);

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



    console.log("JOBS ", jobs);
    console.log("JOBS ", jobs.jobCount);
    console.log("JOBS DATA", jobs.company);

    const jobId = jobs.company?._id;
    console.log("Job id ", jobId);


    useEffect(() => {
        fetchCompanyJobs();
    }, [recruiterId, item?._id]);

    

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
                        <div className="mt-6">
                            {activeTab === "Home" && (
                                <div className="text-gray-700">
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-2">
                                            <div className="bg-white rounded-lg shadow-sm p-6">
                                                <strong>Description:</strong>
                                                <p className="mt-2 text-gray-700">{item.description || "No description provided."}</p>
                                                <div className='flex justify-center mt-4 cursor-pointer'>
                                                    <button className="btn" onClick={() => setActiveTabIndex(1)}>See more</button>
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
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden  items-center">
                                        <div>
                                            <div className="bg-white rounded-xl shadow p-6 h-full flex flex-col">
                                                <h2 className="text-lg font-semibold text-blue-900 mb-2">Company's Values</h2>
                                                <p className="text-gray-700 flex-1">{item.companyValues || "No description provided."}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-32 mt-4 bg-white rounded-lg shadow-md overflow-hidden'>
                                        <div className=''>
                                            <div className="bg-white rounded-lg p-5 ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Website</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5  ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Industry</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Company Size</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">HeadQuaters</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                            <div className="bg-white rounded-lg p-5 ">
                                                <h3 className="font-semibold text-lg text-blue-800 mb-2">Founded year</h3>
                                                {/* <p className="text-gray-700">{item.website || "No description available."}</p> */}
                                            </div>
                                        </div>
                                        <div className=''>
                                            <div className="bg-white rounded-lg p-5  mb-2">
                                                <p className="text-gray-700">{item.website || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5  mb-2">
                                                <p className="text-gray-700">{item.industry || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5  mb-2">
                                                <p className="text-gray-700">{item.companySize || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5  mb-2">
                                                <p className="text-gray-700">{item.headquarters || "No description available."}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-5  mb-2">
                                                <p className="text-gray-700">{item.foundedYear || "No description available."}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mt-4 bg-white rounded-lg shadow-md overflow-hidden'>
                                        <div className='pt-8 text-center text-3xl'>
                                            <p>Follow us on social media</p>
                                        </div>
                                        <div className='flex items-center gap-32 '>
                                            <div className="bg-white w-full h-auto py-8 flex justify-around items-center">

                                                <div className="flex items-center gap-4 mb-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(item.facebook, "_blank")}
                                                        className="bg-blue-50 cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-indigo-200 p-2"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 92 92" fill="none">
                                                            <rect x="0.138672" width="92" height="92" rx="15" fill="#EDF4FF" />
                                                            <path d="M56.4927 48.6403L57.7973 40.3588H49.7611V34.9759C49.7611 32.7114 50.883 30.4987 54.4706 30.4987H58.1756V23.4465C56.018 23.1028 53.8378 22.9168 51.6527 22.8901C45.0385 22.8901 40.7204 26.8626 40.7204 34.0442V40.3588H33.3887V48.6403H40.7204V68.671H49.7611V48.6403H56.4927Z" fill="#337FFF" />
                                                        </svg>
                                                    </button>
                                                </div>


                                                <div className="flex items-center gap-4 mb-4">
                                                    <button type="button"
                                                        onClick={() => window.open(item.instagram, "_blank")}
                                                        className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-red-50 to-pink-50 cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-red-200">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 51 51" fill="none">
                                                            <path d="M17.4456 25.7808C17.4456 21.1786 21.1776 17.4468 25.7826 17.4468C30.3875 17.4468 34.1216 21.1786 34.1216 25.7808C34.1216 30.383 30.3875 34.1148 25.7826 34.1148C21.1776 34.1148 17.4456 30.383 17.4456 25.7808ZM12.9377 25.7808C12.9377 32.8708 18.6883 38.618 25.7826 38.618C32.8768 38.618 38.6275 32.8708 38.6275 25.7808C38.6275 18.6908 32.8768 12.9436 25.7826 12.9436C18.6883 12.9436 12.9377 18.6908 12.9377 25.7808ZM36.1342 12.4346C36.1339 13.0279 36.3098 13.608 36.6394 14.1015C36.9691 14.595 37.4377 14.9797 37.9861 15.2069C38.5346 15.4342 39.1381 15.4939 39.7204 15.3784C40.3028 15.2628 40.8378 14.9773 41.2577 14.5579C41.6777 14.1385 41.9638 13.6041 42.0799 13.0222C42.1959 12.4403 42.1367 11.8371 41.9097 11.2888C41.6828 10.7406 41.2982 10.2719 40.8047 9.94202C40.3112 9.61218 39.7309 9.436 39.1372 9.43576H39.136C38.3402 9.43613 37.5771 9.75216 37.0142 10.3144C36.4514 10.8767 36.1349 11.6392 36.1342 12.4346ZM15.6765 46.1302C13.2377 46.0192 11.9121 45.6132 11.0311 45.2702C9.86323 44.8158 9.02993 44.2746 8.15381 43.4002C7.27768 42.5258 6.73536 41.6938 6.28269 40.5266C5.93928 39.6466 5.53304 38.3214 5.42217 35.884C5.3009 33.2488 5.27668 32.4572 5.27668 25.781C5.27668 19.1048 5.3029 18.3154 5.42217 15.678C5.53324 13.2406 5.94248 11.918 6.28269 11.0354C6.73736 9.86816 7.27888 9.03536 8.15381 8.15976C9.02873 7.28416 9.86123 6.74216 11.0311 6.28976C11.9117 5.94656 13.2377 5.54056 15.6765 5.42976C18.3133 5.30856 19.1054 5.28436 25.7826 5.28436C32.4598 5.28436 33.2527 5.31056 35.8916 5.42976C38.3305 5.54076 39.6539 5.94976 40.537 6.28976C41.7049 6.74216 42.5382 7.28536 43.4144 8.15976C44.2905 9.03416 44.8308 9.86816 45.2855 11.0354C45.6289 11.9154 46.0351 13.2406 46.146 15.678C46.2673 18.3154 46.2915 19.1048 46.2915 25.781C46.2915 32.4572 46.2673 33.2466 46.146 35.884C46.0349 38.3214 45.6267 39.6462 45.2855 40.5266C44.8308 41.6938 44.2893 42.5266 43.4144 43.4002C42.5394 44.2738 41.7049 44.8158 40.537 45.2702C39.6565 45.6134 38.3305 46.0194 35.8916 46.1302C33.2549 46.2514 32.4628 46.2756 25.7826 46.2756C19.1024 46.2756 18.3125 46.2514 15.6765 46.1302ZM15.4694 0.932162C12.8064 1.05336 10.9867 1.47536 9.39755 2.09336C7.75177 2.73156 6.35853 3.58776 4.9663 4.97696C3.57406 6.36616 2.71955 7.76076 2.08097 9.40556C1.46259 10.9948 1.04034 12.8124 0.919069 15.4738C0.795795 18.1394 0.767578 18.9916 0.767578 25.7808C0.767578 32.57 0.795795 33.4222 0.919069 36.0878C1.04034 38.7494 1.46259 40.5668 2.08097 42.156C2.71955 43.7998 3.57426 45.196 4.9663 46.5846C6.35833 47.9732 7.75177 48.8282 9.39755 49.4682C10.9897 50.0862 12.8064 50.5082 15.4694 50.6294C18.138 50.7506 18.9893 50.7808 25.7826 50.7808C32.5759 50.7808 33.4286 50.7526 36.0958 50.6294C38.759 50.5082 40.5774 50.0862 42.1676 49.4682C43.8124 48.8282 45.2066 47.9738 46.5989 46.5846C47.9911 45.1954 48.8438 43.7998 49.4842 42.156C50.1026 40.5668 50.5268 38.7492 50.6461 36.0878C50.7674 33.4202 50.7956 32.57 50.7956 25.7808C50.7956 18.9916 50.7674 18.1394 50.6461 15.4738C50.5248 12.8122 50.1026 10.9938 49.4842 9.40556C48.8438 7.76176 47.9889 6.36836 46.5989 4.97696C45.2088 3.58556 43.8124 2.73156 42.1696 2.09336C40.5775 1.47536 38.7588 1.05136 36.0978 0.932162C33.4306 0.810962 32.5779 0.780762 25.7846 0.780762C18.9913 0.780762 18.138 0.808962 15.4694 0.932162Z" fill="url(#paint0_radial_7092_54379)" />
                                                            <path d="M17.4456 25.7808C17.4456 21.1786 21.1776 17.4468 25.7826 17.4468C30.3875 17.4468 34.1216 21.1786 34.1216 25.7808C34.1216 30.383 30.3875 34.1148 25.7826 34.1148C21.1776 34.1148 17.4456 30.383 17.4456 25.7808ZM12.9377 25.7808C12.9377 32.8708 18.6883 38.618 25.7826 38.618C32.8768 38.618 38.6275 32.8708 38.6275 25.7808C38.6275 18.6908 32.8768 12.9436 25.7826 12.9436C18.6883 12.9436 12.9377 18.6908 12.9377 25.7808ZM36.1342 12.4346C36.1339 13.0279 36.3098 13.608 36.6394 14.1015C36.9691 14.595 37.4377 14.9797 37.9861 15.2069C38.5346 15.4342 39.1381 15.4939 39.7204 15.3784C40.3028 15.2628 40.8378 14.9773 41.2577 14.5579C41.6777 14.1385 41.9638 13.6041 42.0799 13.0222C42.1959 12.4403 42.1367 11.8371 41.9097 11.2888C41.6828 10.7406 41.2982 10.2719 40.8047 9.94202C40.3112 9.61218 39.7309 9.436 39.1372 9.43576H39.136C38.3402 9.43613 37.5771 9.75216 37.0142 10.3144C36.4514 10.8767 36.1349 11.6392 36.1342 12.4346ZM15.6765 46.1302C13.2377 46.0192 11.9121 45.6132 11.0311 45.2702C9.86323 44.8158 9.02993 44.2746 8.15381 43.4002C7.27768 42.5258 6.73536 41.6938 6.28269 40.5266C5.93928 39.6466 5.53304 38.3214 5.42217 35.884C5.3009 33.2488 5.27668 32.4572 5.27668 25.781C5.27668 19.1048 5.3029 18.3154 5.42217 15.678C5.53324 13.2406 5.94248 11.918 6.28269 11.0354C6.73736 9.86816 7.27888 9.03536 8.15381 8.15976C9.02873 7.28416 9.86123 6.74216 11.0311 6.28976C11.9117 5.94656 13.2377 5.54056 15.6765 5.42976C18.3133 5.30856 19.1054 5.28436 25.7826 5.28436C32.4598 5.28436 33.2527 5.31056 35.8916 5.42976C38.3305 5.54076 39.6539 5.94976 40.537 6.28976C41.7049 6.74216 42.5382 7.28536 43.4144 8.15976C44.2905 9.03416 44.8308 9.86816 45.2855 11.0354C45.6289 11.9154 46.0351 13.2406 46.146 15.678C46.2673 18.3154 46.2915 19.1048 46.2915 25.781C46.2915 32.4572 46.2673 33.2466 46.146 35.884C46.0349 38.3214 45.6267 39.6462 45.2855 40.5266C44.8308 41.6938 44.2893 42.5266 43.4144 43.4002C42.5394 44.2738 41.7049 44.8158 40.537 45.2702C39.6565 45.6134 38.3305 46.0194 35.8916 46.1302C33.2549 46.2514 32.4628 46.2756 25.7826 46.2756C19.1024 46.2756 18.3125 46.2514 15.6765 46.1302ZM15.4694 0.932162C12.8064 1.05336 10.9867 1.47536 9.39755 2.09336C7.75177 2.73156 6.35853 3.58776 4.9663 4.97696C3.57406 6.36616 2.71955 7.76076 2.08097 9.40556C1.46259 10.9948 1.04034 12.8124 0.919069 15.4738C0.795795 18.1394 0.767578 18.9916 0.767578 25.7808C0.767578 32.57 0.795795 33.4222 0.919069 36.0878C1.04034 38.7494 1.46259 40.5668 2.08097 42.156C2.71955 43.7998 3.57426 45.196 4.9663 46.5846C6.35833 47.9732 7.75177 48.8282 9.39755 49.4682C10.9897 50.0862 12.8064 50.5082 15.4694 50.6294C18.138 50.7506 18.9893 50.7808 25.7826 50.7808C32.5759 50.7808 33.4286 50.7526 36.0958 50.6294C38.759 50.5082 40.5774 50.0862 42.1676 49.4682C43.8124 48.8282 45.2066 47.9738 46.5989 46.5846C47.9911 45.1954 48.8438 43.7998 49.4842 42.156C50.1026 40.5668 50.5268 38.7492 50.6461 36.0878C50.7674 33.4202 50.7956 32.57 50.7956 25.7808C50.7956 18.9916 50.7674 18.1394 50.6461 15.4738C50.5248 12.8122 50.1026 10.9938 49.4842 9.40556C48.8438 7.76176 47.9889 6.36836 46.5989 4.97696C45.2088 3.58556 43.8124 2.73156 42.1696 2.09336C40.5775 1.47536 38.7588 1.05136 36.0978 0.932162C33.4306 0.810962 32.5779 0.780762 25.7846 0.780762C18.9913 0.780762 18.138 0.808962 15.4694 0.932162Z" fill="url(#paint1_radial_7092_54379)" />
                                                            <defs>
                                                                <radialGradient id="paint0_radial_7092_54379" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7.41436 51.017) scale(65.31 65.2708)">
                                                                    <stop offset="0.09" stop-color="#FA8F21" />
                                                                    <stop offset="0.78" stop-color="#D82D7E" />
                                                                </radialGradient>
                                                                <radialGradient id="paint1_radial_7092_54379" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(31.1086 53.257) scale(51.4733 51.4424)">
                                                                    <stop offset="0.64" stop-color="#8C3AAA" stop-opacity="0" />
                                                                    <stop offset="1" stop-color="#8C3AAA" />
                                                                </radialGradient>
                                                            </defs>
                                                        </svg>
                                                    </button>

                                                </div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    <button type="button"
                                                        onClick={() => window.open(item.x, "_blank")}
                                                        className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-red-50 to-pink-50 cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-red-200">
                                                        <svg className="cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-indigo-200" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 93 92" fill="none">
                                                            <rect x="0.138672" width="91.5618" height="91.5618" rx="15" fill="#F7F7F7" />
                                                            <path d="M50.7568 42.1716L69.3704 21H64.9596L48.7974 39.383L35.8887 21H21L40.5205 48.7983L21 71H25.4111L42.4788 51.5869L56.1113 71H71L50.7557 42.1716H50.7568ZM44.7152 49.0433L42.7374 46.2752L27.0005 24.2492H33.7756L46.4755 42.0249L48.4533 44.7929L64.9617 67.8986H58.1865L44.7152 49.0443V49.0433Z" fill="black" />
                                                        </svg>
                                                    </button>

                                                </div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    <button type="button"
                                                        onClick={() => window.open(item.whatsapp, "_blank")}
                                                        className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-red-50 to-pink-50 cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-red-200">
                                                        <svg className="cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-green-200" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 93 92" fill="none">
                                                            <rect x="1.13867" width="91.5618" height="91.5618" rx="15" fill="#ECFFF5" />
                                                            <path d="M23.5762 66.8405L26.8608 54.6381C24.2118 49.8847 23.3702 44.3378 24.4904 39.0154C25.6106 33.693 28.6176 28.952 32.9594 25.6624C37.3012 22.3729 42.6867 20.7554 48.1276 21.1068C53.5685 21.4582 58.6999 23.755 62.5802 27.5756C66.4604 31.3962 68.8292 36.4844 69.2519 41.9065C69.6746 47.3286 68.1228 52.7208 64.8813 57.0938C61.6399 61.4668 56.9261 64.5271 51.605 65.7133C46.284 66.8994 40.7125 66.1318 35.9131 63.5513L23.5762 66.8405ZM36.508 58.985L37.2709 59.4365C40.7473 61.4918 44.8076 62.3423 48.8191 61.8555C52.8306 61.3687 56.5681 59.5719 59.4489 56.7452C62.3298 53.9185 64.1923 50.2206 64.7463 46.2279C65.3002 42.2351 64.5143 38.1717 62.5113 34.6709C60.5082 31.1701 57.4003 28.4285 53.6721 26.8734C49.9438 25.3184 45.8045 25.0372 41.8993 26.0736C37.994 27.11 34.5422 29.4059 32.0817 32.6035C29.6212 35.801 28.2903 39.7206 28.2963 43.7514C28.293 47.0937 29.2197 50.3712 30.9732 53.2192L31.4516 54.0061L29.6153 60.8167L36.508 58.985Z" fill="#00D95F" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M55.0259 46.8847C54.5787 46.5249 54.0549 46.2716 53.4947 46.1442C52.9344 46.0168 52.3524 46.0186 51.793 46.1495C50.9524 46.4977 50.4093 47.8134 49.8661 48.4713C49.7516 48.629 49.5833 48.7396 49.3928 48.7823C49.2024 48.8251 49.0028 48.797 48.8316 48.7034C45.7543 47.5012 43.1748 45.2965 41.5122 42.4475C41.3704 42.2697 41.3033 42.044 41.325 41.8178C41.3467 41.5916 41.4555 41.3827 41.6286 41.235C42.2344 40.6368 42.6791 39.8959 42.9218 39.0809C42.9756 38.1818 42.7691 37.2863 42.3269 36.5011C41.985 35.4002 41.3344 34.42 40.4518 33.6762C39.9966 33.472 39.4919 33.4036 38.9985 33.4791C38.5052 33.5546 38.0443 33.7709 37.6715 34.1019C37.0242 34.6589 36.5104 35.3537 36.168 36.135C35.8256 36.9163 35.6632 37.7643 35.6929 38.6165C35.6949 39.0951 35.7557 39.5716 35.8739 40.0354C36.1742 41.1497 36.636 42.2144 37.2447 43.1956C37.6839 43.9473 38.163 44.6749 38.6801 45.3755C40.3607 47.6767 42.4732 49.6305 44.9003 51.1284C46.1183 51.8897 47.42 52.5086 48.7799 52.973C50.1924 53.6117 51.752 53.8568 53.2931 53.6824C54.1711 53.5499 55.003 53.2041 55.7156 52.6755C56.4281 52.1469 56.9995 51.4518 57.3795 50.6512C57.6028 50.1675 57.6705 49.6269 57.5735 49.1033C57.3407 48.0327 55.9053 47.4007 55.0259 46.8847Z" fill="#00D95F" />
                                                        </svg>
                                                    </button>

                                                </div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    <button type="button"
                                                        onClick={() => window.open(item.linkedin, "_blank")}
                                                        className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-red-50 to-pink-50 cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-red-200">
                                                        <svg className="cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-blue-200" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 92 93" fill="none">
                                                            <rect x="0.138672" y="1" width="91.5618" height="91.5618" rx="15" fill="#EEFAFF" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.6975 21.5618C22.6561 21.5618 21 23.1674 21 25.1456V68.0091C21 69.9875 22.6563 71.5918 24.6975 71.5918H67.3325C69.3747 71.5918 71.03 69.9873 71.03 68.0086V25.1456C71.03 23.1674 69.3747 21.5618 67.3325 21.5618H24.6975ZM36.2032 40.9068V63.4304H28.7167V40.9068H36.2032ZM36.6967 33.9411C36.6967 36.1025 35.0717 37.8321 32.4615 37.8321L32.4609 37.8319H32.4124C29.8998 37.8319 28.2754 36.1023 28.2754 33.9409C28.2754 31.7304 29.9489 30.0491 32.5111 30.0491C35.0717 30.0491 36.6478 31.7304 36.6967 33.9411ZM47.833 63.4304H40.3471L40.3469 63.4312C40.3469 63.4312 40.4452 43.0205 40.3475 40.9075H47.8336V44.0957C48.8288 42.5613 50.6098 40.3787 54.5808 40.3787C59.5062 40.3787 63.1991 43.598 63.1991 50.516V63.4304H55.7133V51.3822C55.7133 48.354 54.6293 46.2887 51.921 46.2887C49.8524 46.2887 48.6206 47.6815 48.0796 49.0271C47.8819 49.5072 47.833 50.1813 47.833 50.8535V63.4304Z" fill="#006699" />
                                                        </svg>
                                                    </button>

                                                </div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    <button type="button"
                                                        onClick={() => window.open(item.gmail, "_blank")}
                                                        className="w-12 h-12 flex items-center justify-center bg-gray-100 cursor-pointer rounded-md shadow-md shadow-transparent transition-all duration-300 hover:shadow-blue-200">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 54 41" fill="none">
                                                            <path
                                                                d="M4.00654 40.1236H12.4893V19.5227L0.371094 10.4341V36.4881C0.371094 38.4997 2.00099 40.1236 4.00654 40.1236Z"
                                                                fill="#4285F4" />
                                                            <path
                                                                d="M41.5732 40.1236H50.056C52.0676 40.1236 53.6914 38.4937 53.6914 36.4881V10.4341L41.5732 19.5227"
                                                                fill="#34A853" />
                                                            <path
                                                                d="M41.5732 3.7693V19.5229L53.6914 10.4343V5.58702C53.6914 1.09118 48.5594 -1.47181 44.9663 1.22448"
                                                                fill="#FBBC04" />
                                                            <path d="M12.4893 19.5227V3.76904L27.0311 14.6754L41.5729 3.76904V19.5227L27.0311 30.429"
                                                                fill="#EA4335" />
                                                            <path
                                                                d="M0.371094 5.58702V10.4343L12.4893 19.5229V3.7693L9.09617 1.22448C5.49708 -1.47181 0.371094 1.09118 0.371094 5.58702Z"
                                                                fill="#C5221F" />
                                                        </svg>
                                                    </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                            {activeTab === "Jobs" && (
                                <div>
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <strong className="block mb-2 text-3xl p-4">Open Positions</strong>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {jobs?.jobs?.length ? (
                                                jobs.jobs.map((j, idx) => (
                                                    <Link to={`/job/${j._id}`}>
                                                        <div key={j?._id || idx} className="card bg-base-100 shadow-sm ">
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
                                                    </Link>
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