import React from 'react'
import Google from '../../../assets/imgs/companyLogo/google.png';
import { CiStar } from 'react-icons/ci';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { FaCode } from 'react-icons/fa';
import { MdOutlinePeople } from 'react-icons/md';
import { RiBriefcase4Line } from 'react-icons/ri';


const CompanyList = () => {
    return (
        <>
            <div className='pt-5 flex '>
                <div className='grid grid-cols-4 gap-5 '>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>
                    <div className="card bg-white border border-gray-200 rounded-md shadow-sm  w-full">
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots on the same line */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">Google</h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>


                                    {/* Rating Section */}
                                    <div className="flex items-center gap-2">
                                        <CiStar /> 4.6 <span>200 reviews</span>
                                    </div>
                                </div>
                            </div>

                            <div className='text-[#495057]'>
                                <div className='flex items-center gap-1 mb-3'>
                                    <HiOutlineLocationMarker size={23} />
                                    <p>NYC</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <RiBriefcase4Line size={23} />
                                    <p>Technology</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <MdOutlinePeople size={23} />
                                    <p>120,00 Employees</p>
                                </div>
                                <div className='flex items-center gap-1 mb-3'>
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className='text-[#495057]'>Google is a global technology company best known for its search engine. It also offers products  and <span className='text-blue-700 font-bold'>see more....</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default CompanyList