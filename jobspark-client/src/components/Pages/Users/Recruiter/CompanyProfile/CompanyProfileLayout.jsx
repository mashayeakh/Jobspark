import React, { useState } from 'react'
import { IoCalendarOutline, IoPeople } from "react-icons/io5";

const CompanyProfileLayout = () => {
    const [activeTab, setActiveTab] = useState("basic");

    const tabs = [
        { key: "basic", label: "Basic Company Info" },
        { key: "details", label: "Company Details" },
        // { key: "about", label: "About the Company" },
        { key: "social", label: "Social & Media Links" },
        { key: "gallery", label: "Media / Gallery" },
    ];

    console.log("Tabs:", tabs.length);

    const progress = 20;
    const snappedProgress = Math.floor(progress / 10) * 10;

    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // const [formData, setFormData] = useState({
    //     companyName: "",
    //     companyEmail: "",
    //     companyPhone: "",
    //     facebook: "",
    //     website: "",
    //     address: "",
    // });
    // const validateStep = () => {
    //     const currentErrors = {};

    //     if (activeTab === "basic") {
    //         if (!formData.companyName.trim()) currentErrors.companyName = "Required";
    //         if (!formData.companyEmail.trim()) currentErrors.companyEmail = "Required";
    //         if (!formData.companyPhone.trim()) currentErrors.companyPhone = "Required";
    //     }

    //     if (activeTab === "social") {
    //         if (!formData.facebook.trim()) currentErrors.facebook = "Required";
    //         if (!formData.website.trim()) currentErrors.website = "Required";
    //     }

    //     if (activeTab === "address") {
    //         if (!formData.address.trim()) currentErrors.address = "Required";
    //     }

    //     // setErrors(currentErrors);
    //     return Object.keys(currentErrors).length === 0;
    // };

    // const handleNext = () => {
    //     const isValid = validateStep();
    //     if (!isValid) return;

    //     if (activeTabIndex === tabs.length - 1) {
    //         handleSubmit();
    //     } else {
    //         setActiveTabIndex((prev) => prev + 1);
    //     }
    // };

    // const handleSubmit = () => {
    //     console.log("✅ Form submitted successfully:", formData);
    //     alert("Form submitted successfully!");
    // };

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prev) => ({ ...prev, [name]: value }));
    // };



    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., send data to an API
        console.log("Form submitted");
    }




    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Header */}
            <div className="p-8">
                <p className="text-4xl font-semibold">Complete your company details</p>
            </div>

            {/* Tabs */}
            <div className="px-8 border-b border-gray-200">
                <ul className="flex space-x-8">
                    {tabs.map(tab => (
                        <li
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`cursor-pointer pb-2 font-medium transition-all ${activeTab === tab.key
                                ? "text-black border-b-2 border-black"
                                : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row gap-6 p-8">
                {/* Form Section */}
                <div className="flex-[2]">

                    <div className="">
                        <form onSubmit={handleSubmit}>
                            {activeTab === "basic" && <div>
                                <div className="border rounded-lg p-6 space-y-6 bg-gray-50 shadow-sm">
                                    {/* Row 1 */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium mb-1 block">Company Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Jarvis"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <label className="text-sm font-medium mb-1 block">Company Email</label>
                                            <input
                                                type="email"
                                                defaultValue="info@jarvis.com"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium mb-1 block">Tagline / Slogan</label>
                                            <input
                                                type="text"
                                                defaultValue="Connecting talent with opportunity"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium mb-1 block">Website URL</label>
                                            <input
                                                type="url"
                                                defaultValue="https://www.example.com"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 3 */}
                                    <div className="flex gap-6">

                                        <div className="flex gap-6">
                                            <div className="flex-1">
                                                <label className="text-sm font-medium mb-1 block">Founed Year</label>
                                                <input
                                                    type="text"
                                                    defaultValue="2000"
                                                    className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <label className="text-sm font-medium mb-1 block">Phone Number</label>
                                            <input
                                                type="text"
                                                defaultValue="(480) 555-0103"
                                                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium mb-1 block">Company Logo</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="file-input file-input-md w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>}

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                                >
                                    {/* {activeTabIndex === tabs.length - 1 ? "Submit" : "Next"} */}
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex-[1]">
                    <div className="border rounded-lg bg-gray-50 shadow-sm p-6">
                        <IoPeople size={40} className="text-blue-600" />
                        <h2 className="flex justify-between items-center text-lg font-semibold mt-4">
                            Profile Completion
                            <span className="text-gray-600">{progress}%</span>
                        </h2>

                        {/* Progress Bar */}
                        <div className="w-full h-4 bg-gray-300 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-green-500"
                                style={{ width: `${snappedProgress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CompanyProfileLayout;
