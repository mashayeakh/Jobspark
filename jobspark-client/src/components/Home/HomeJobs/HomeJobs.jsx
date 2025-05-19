import React, { useState } from 'react'
import { FaRegHeart } from "react-icons/fa";
import { BsFire } from "react-icons/bs";
import Google from '../../../assets/imgs/companyLogo/google.png';
import newIcon from '../../../assets/imgs/icons/new.png';
import { BiGame } from 'react-icons/bi';
import { FaLocationDot } from 'react-icons/fa6';
import { AiOutlineDollar } from 'react-icons/ai';

const HomeJobs = () => {


    const [activeTab, setActiveTab] = useState("hot");


    const handleHotJobs = (e) => {
        e.preventDefault();
        console.log("Clicked");
        setActiveTab("hot");

    }

    const handleRecentlyAddedJobs = (e) => {
        e.preventDefault();
        console.log("Clicked");
        setActiveTab("recent");
    }



    return (
        <div>
            <div>
                <div className='pb-5'>
                    <div className="flex gap-4 mb-6 justify-center my-[5%] border w-fit mx-auto items-center p-2 bg-black">
                        <button onClick={handleHotJobs} className={`px-4 py-2 text-white rounded cursor-pointer ${activeTab === "hot" ? "bg-blue" : "bg-blue-600"}  `}>
                            🔥 Hot Jobs
                        </button>
                        <button onClick={handleRecentlyAddedJobs} className={`px-4 py-2 text-white rounded cursor-pointer ${activeTab === "recent" ? "bg-green" : "bg-blue-600"}  `}>
                            🆕 Recent Jobs
                        </button>
                    </div>

                    {/* jobs  */}
                    <div className='flex justify-center'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <div className='flex justify-between items-center'>
                                    <p className='pb-2'>
                                        <div className="badge badge-success">Full time</div>
                                    </p>
                                    <div>
                                        <BsFire size={24} color='red' cursor={"pointer"} />
                                    </div>
                                </div>

                                {/* Centered image */}
                                <figure className="flex justify-center">
                                    <img
                                        src={Google}
                                        alt="Shoes" className='w-[50%]' />
                                </figure>
                                <div className="card-body text-white">
                                    <h2 className="card-title">Software Developer</h2>
                                    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                                </div>
                                <div className='flex justify-between items-center '>

                                    <div>
                                        <button className='btn btn-primary'>Apply Now</button>
                                    </div>

                                    <div className='flex justify-between items-center text-white'>
                                        <FaLocationDot /> <span className='mr-4'>Remote</span>
                                        <AiOutlineDollar /> <span>$5000</span>
                                    </div>

                                </div>

                            </div>
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <div className='flex justify-between items-center'>
                                    <p className='pb-2'>
                                        <div className="badge badge-success">Full time</div>
                                    </p>
                                    <div>
                                        <FaRegHeart size={24} color='red' cursor={"pointer"} />
                                    </div>
                                </div>

                                {/* Centered image */}
                                <figure className="flex justify-center">
                                    <img
                                        src={Google}
                                        alt="Shoes" className='w-[50%]' />
                                </figure>
                                <div className="card-body text-white">
                                    <h2 className="card-title">Software Developer</h2>
                                    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                                </div>
                                <div className='flex justify-between items-center '>

                                    <div>
                                        <button className='btn btn-primary'>Apply Now</button>
                                    </div>

                                    <div className='flex justify-between items-center text-white'>
                                        <FaLocationDot /> <span className='mr-4'>Remote</span>
                                        <AiOutlineDollar /> <span>$5000</span>
                                    </div>

                                </div>

                            </div>
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <div className='flex justify-between items-center'>
                                    <p className='pb-2'>
                                        <div className="badge badge-success">Full time</div>
                                    </p>
                                    <div>
                                        <img src={newIcon} alt="" className='w-10' />
                                        {/* <FaRegHeart size={24} color='red' cursor={"pointer"} /> */}
                                    </div>
                                </div>

                                {/* Centered image */}
                                <figure className="flex justify-center">
                                    <img
                                        src={Google}
                                        alt="Shoes" className='w-[50%]' />
                                </figure>
                                <div className="card-body text-white">
                                    <h2 className="card-title">Software Developer</h2>
                                    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                                </div>
                                <div className='flex justify-between items-center '>

                                    <div>
                                        <button className='btn btn-primary'>Apply Now</button>
                                    </div>

                                    <div className='flex justify-between items-center text-white'>
                                        <FaLocationDot /> <span className='mr-4'>Remote</span>
                                        <AiOutlineDollar /> <span>$5000</span>
                                    </div>

                                </div>

                            </div>
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <div className='flex justify-between items-center'>
                                    <p className='pb-2'>
                                        <div className="badge badge-success">Full time</div>
                                    </p>
                                    <div>
                                        <FaRegHeart size={24} color='red' cursor={"pointer"} />
                                    </div>
                                </div>

                                {/* Centered image */}
                                <figure className="flex justify-center">
                                    <img
                                        src={Google}
                                        alt="Shoes" className='w-[50%]' />
                                </figure>
                                <div className="card-body text-white">
                                    <h2 className="card-title">Software Developer</h2>
                                    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                                </div>
                                <div>
                                    <button className='btn btn-primary'>Apply Now</button>
                                </div>
                            </div>
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <div className='flex justify-between items-center'>
                                    <p className='pb-2'>
                                        <div className="badge badge-success">Full time</div>
                                    </p>
                                    <div>
                                        <FaRegHeart size={24} color='red' cursor={"pointer"} />
                                    </div>
                                </div>

                                {/* Centered image */}
                                <figure className="flex justify-center">
                                    <img
                                        src={Google}
                                        alt="Shoes" className='w-[50%]' />
                                </figure>
                                <div className="card-body text-white">
                                    <h2 className="card-title">Software Developer</h2>
                                    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                                </div>
                                <div>
                                    <button className='btn btn-primary'>Apply Now</button>
                                </div>
                            </div>
                            <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                                <div className='flex justify-between items-center'>
                                    <p className='pb-2'>
                                        <div className="badge badge-success">Full time</div>
                                    </p>
                                    <div>
                                        <FaRegHeart size={24} color='red' cursor={"pointer"} />
                                    </div>
                                </div>

                                {/* Centered image */}
                                <figure className="flex justify-center">
                                    <img
                                        src={Google}
                                        alt="Shoes" className='w-[50%]' />
                                </figure>
                                <div className="card-body text-white">
                                    <h2 className="card-title">Software Developer</h2>
                                    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                                </div>
                                <div>
                                    <button className='btn btn-primary'>Apply Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeJobs