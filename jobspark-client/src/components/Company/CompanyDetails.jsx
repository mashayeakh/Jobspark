import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import Google from '../../assets/imgs/companyLogo/google.png';
import { MdArrowOutward } from "react-icons/md";
import { FaRegBookmark } from "react-icons/fa6";



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
    return (
        <div>
            {/* Company Cover Image */}
            {/* <div className="w-full h-56 md:h-72 lg:h-80 relative">
                <img
                    src="https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg"
                    alt="Company Cover"
                    className="w-full h-full object-cover object-center rounded-b-lg"
                />
            </div> */}
            {/* Company Info */}
            <div className="px-8 md:px-32 mt-4">
                {/* <h1 className="text-2xl font-bold mb-4">{data?.data?.companyName}</h1> */}
                <div className="flex gap-8">
                    <div className="flex-[3] ">
                        {/* Cover Image Section */}
                        <div className='bg-white border rounded-md shadow-sm w-full h-fit overflow-hidden relative'>

                            <div className="w-full h-56 md:h-72 lg:h-80 relative">
                                <img
                                    src="https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg"
                                    alt="Company Cover"
                                    className="w-full h-full object-cover object-center rounded-b-md"
                                />
                                <img
                                    src={item.logo || Google}
                                    alt="Company Logo"
                                    className="w-28 h-28 rounded-xl border-4 border-white absolute left-6 -bottom-14 bg-white p-2 shadow-md"
                                />
                            </div>

                            {/* Main Info */}
                            <div className="mt-20 px-6 pb-6 space-y-2">
                                <h1 className="text-3xl font-bold uppercase">{item.companyName}</h1>
                                <p className="text-gray-600">{item.tagline}</p>

                                <div className="flex flex-wrap gap-4 text-gray-700 text-sm ">
                                    <div><strong>Industry:</strong> {item.industry}</div>
                                    <div><strong>Location:</strong> {item.headquarters}</div>
                                    <div><strong>Founded:</strong> {item.foundedYear}</div>
                                    <div><strong>Size:</strong> {item.companySize} employees</div>
                                </div>
                                <div className='flex gap-4 mt-4'>
                                    <div>
                                        <button className="btn btn-primary rounded-2xl ">Bookmark <FaRegBookmark />
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline btn-primary rounded-2xl ">Visit Website <MdArrowOutward size={22} />
                                        </button>
                                    </div>
                                    <div>
                                        <button className="btn btn-outline btn-primary rounded-2xl">Primary</button>
                                    </div>
                                </div>
                                <div className='divider '></div>

                                <ul className="flex space-x-8">
                                    {tabSections.map((tab, index) => (
                                        <li
                                            key={tab.key}
                                            onClick={() => setActiveTabIndex(index)}
                                            className={`cursor-pointer font-medium transition-all ${activeTabIndex === index
                                                ? "text-black border-b-2 border-black"
                                                : "text-gray-400 hover:text-black"
                                                }`}
                                        >
                                            {tab.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {activeTab === "Home" && (
                                <div>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos nesciunt natus eaque autem blanditiis ea maiores aut. Quisquam voluptatibus molestias veniam rerum sint quaerat voluptatem, excepturi modi, vitae a rem.
                                </div>
                            )}
                            {activeTab === "About" && (
                                <div>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam fugiat expedita ducimus magni ullam tempora provident nemo quasi, fuga quam voluptatibus inventore! Vitae neque, non natus esse, voluptatem, eaque laboriosam aliquam perferendis iusto nihil voluptate repudiandae dolor? Architecto, quasi quo consectetur, a perferendis earum rem hic ea magni soluta deserunt?
                                </div>
                            )}
                            {activeTab === "Jobs" && (
                                <div>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos nesciunt natus eaque autem blanditiis ea maiores aut. Quisquam voluptatibus molestias veniam rerum sint quaerat voluptatem, excepturi modi, vitae a rem.
                                </div>
                            )}
                        </div>
                        <div className='mt-12 bg-white border rounded-md shadow-sm w-full h-fit overflow-hidden relative'>
                            <strong>Desciption:</strong>
                            <p>
                                {item.description}
                            </p>
                        </div>
                        <div className='mt-12 bg-white border rounded-md shadow-sm w-full h-fit overflow-hidden relative'>
                            <strong>Recent Jobs:</strong>
                            <p>
                                {item.description}
                            </p>
                        </div>
                    </div>


                    <div className="flex-[1]">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio laudantium laborum sed a quidem cum illo ex aperiam blanditiis dignissimos ipsum provident libero commodi illum, modi labore ipsam temporibus repudiandae.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetails