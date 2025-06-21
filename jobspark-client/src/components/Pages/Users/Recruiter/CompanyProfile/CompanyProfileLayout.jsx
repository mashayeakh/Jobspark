import React, { useState } from 'react'

const CompanyProfileLayout = () => {

    const [activeTab, setActiveTab] = useState("basic");

    const tabs = [
        { key: "basic", label: "Basic Company Info" },
        { key: "details", label: "Company Details" },
        { key: "about", label: "About the Company" },
        { key: "social", label: "Social & Media Links" },
        { key: "gallery", label: "Media / Gallery" },
    ];



    return (
        <>
            <div className='bg-[#1a1b26] min-h-screen text-white'>
                <div className='p-4'>
                    <p className='text-4xl'>Complete your company details</p>
                </div>
                <div className='flex justify-center text-white bg-[#23243a] py-4 shadow-md overflow-x-auto'>
                    <ul className='flex space-x-8 min-w-max'>
                        {tabs.map(tab => (
                            <li
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`cursor-pointer transition-colors whitespace-nowrap font-medium ${activeTab === tab.key ? "text-[#7aa2f7]" : "text-white hover:text-[#7aa2f7]"
                                    }`}
                            >
                                {tab.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6">
                    {activeTab === "basic" && (
                        <div> Basic </div>
                    )}
                    {activeTab === "details" && (
                        <div> details </div>
                    )}
                    {activeTab === "about" && (
                        <div> {/* About the Company Form */} </div>
                    )}
                    {activeTab === "social" && (
                        <div> {/* Social & Media Links Form */} </div>
                    )}
                    {activeTab === "gallery" && (
                        <div> {/* Media / Gallery Form */} </div>
                    )}
                </div>


            </div>
        </>
    )
}

export default CompanyProfileLayout