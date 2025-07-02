import React, { useContext, useEffect, useState } from 'react'
import { Flat, Heat, Nested } from '@alptugidin/react-circular-progress-bar'
import { UserContext } from '../../Context/UserContextProvider';
import { AuthContext } from '../../Context/AuthContextProvider';
import { PiDotsThreeCircleVertical } from "react-icons/pi";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router';




const getColorByPercentage = (percentage) => {
    if (percentage === 0) return '#ff4d4f';       // Red
    if (percentage > 0 && percentage < 40) return '#ff7a45'; // Slightly lighter red
    if (percentage < 70) return '#faad14';       // Orange
    return '#52c41a';                            // Green
};

const totalFields = 21; // total number of profile fields


const calculateProfileCompletion = (user) => {
    let filledFields = 0;

    // Basic user fields
    if (user.name) filledFields++;
    if (user.location) filledFields++;
    if (user.skills?.length) filledFields++;

    const profile = user.jobSeekerProfile || {};

    // Job seeker profile fields
    if (profile.phoneNumber) filledFields++;
    if (profile.roles) filledFields++;
    if (profile.experienceLevel) filledFields++;
    if (profile.bio) filledFields++;
    if (profile.profileImage) filledFields++;
    if (profile.resume) filledFields++;
    if (profile.certificates?.length) filledFields++;

    // Education
    const edu = profile.education || {};
    if (edu.university) filledFields++;
    if (edu.degree) filledFields++;
    if (edu.fieldOfStudy) filledFields++;
    if (edu.graduationYear) filledFields++;

    // Social links
    const social = profile.socialLinks || {};
    if (social.linkedin) filledFields++;
    if (social.github) filledFields++;
    if (social.portfolio) filledFields++;

    // Preferences
    if (profile.preferredJobTitles?.length) filledFields++;
    if (profile.preferredLocations?.length) filledFields++;

    // Done — return percentage
    const percentage = Math.round((filledFields / totalFields) * 100);
    return percentage;
};


const Profile = () => {


    const [userProfile, setUserProfile] = useState([]);
    // const percentage = 100;
    const percentage = calculateProfileCompletion(userProfile);
    const color = getColorByPercentage(percentage);
    const { user } = useContext(AuthContext);
    const userId = user?._id;

    //fetch the profile
    const { getProfileById } = useContext(UserContext);


    const fetchingProfile = async () => {
        const url = `http://localhost:5000/api/v1/user/${userId}`
        console.log("Hititng to ", url);
        const result = await getProfileById(url);
        setUserProfile(result);
    }

    useEffect(() => {
        if (!userId) return;

        fetchingProfile();
    }, [userId])

    console.log("User Profile -> ", userProfile);
    // console.log("User Proficxv zdfvrwefvwele ->", userProfile.jobSeekerProfile);


    //* Toggle bahavior
    const [editMode, setEditMode] = useState(false);

    const profileFields = [
        { label: "Basic Info", value: [user?.name, user?.email].filter(Boolean).join(" / ") },
        { label: "Phone Number", value: user?.jobSeekerProfile?.phoneNumber },
        { label: "University", value: user?.jobSeekerProfile?.education?.university },
        { label: "Degree", value: user?.jobSeekerProfile?.education?.degree },
        { label: "Field of Study", value: user?.jobSeekerProfile?.education?.fieldOfStudy },
        { label: "Graduation Year", value: user?.jobSeekerProfile?.education?.graduationYear },
        { label: "Preferred Roles", value: user?.jobSeekerProfile?.roles },
        { label: "Experience Level", value: user?.jobSeekerProfile?.experienceLevel },
        { label: "Skills", value: user?.skills?.length > 0 ? "yes" : "" },
        { label: "Resume", value: user?.jobSeekerProfile?.resume },
        { label: "Bio", value: user?.jobSeekerProfile?.bio },
        { label: "Profile Image", value: user?.jobSeekerProfile?.profileImage },
        { label: "LinkedIn", value: user?.jobSeekerProfile?.socialLinks?.linkedin },
        { label: "GitHub", value: user?.jobSeekerProfile?.socialLinks?.github },
        { label: "Portfolio", value: user?.jobSeekerProfile?.socialLinks?.portfolio },
    ];

    // const navigate = useNavigate();

    const handleCancel = () => {
        window.location.reload();
        // navigate("/profile");
    };


    return (
        <div className='bg-[#f8f9fa] '>
            <div className='flex px-12 py-8 gap-4'>
                {/* Profile Completion Card */}
                <div className='flex-[1]  bg-white shadow-md p-6 rounded-3xl flex flex-col items-center h-fit'>
                    <div className='text-2xl text-center mb-4 font-semibold'>
                        Complete your profile
                    </div>
                    <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow" style={{ width: 260 }}>
                        <div className="flex flex-col items-center">
                            <div className="relative w-full mb-6" style={{
                                height: 180,
                                filter: `drop-shadow(0 0 8px ${color})` // Adjust the color and blur radius as needed
                            }}>                                <Flat
                                    progress={percentage}
                                    range={{ from: 0, to: 100 }}
                                    sign={{ value: '%', position: 'end' }}
                                    showMiniCircle={true}
                                    showValue={true}
                                    sx={{
                                        strokeColor: color,
                                        barWidth: 14,
                                        // bgStrokeColor: '#f8fafc',
                                        // bgColor: { value: '#ffffff', transparency: '0' },
                                        shape: 'full',
                                        strokeLinecap: 'round',
                                        valueSize: 28,
                                        valueWeight: 'bold',
                                        valueColor: '#1e293b',
                                        valueFamily: 'Inter, sans-serif',
                                        textSize: 12,
                                        textWeight: '600',
                                        textColor: '#64748b',
                                        textFamily: 'Inter, sans-serif',
                                        miniCircleColor: color,
                                        miniCircleSize: 8,
                                        valueAnimation: true,
                                        intersectionEnabled: true,
                                        loadingTime: 800,
                                    }}
                                />
                            </div>

                            <div className="mt-4 w-full">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: color
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <ul className="mt-4 space-y-3">
                        {profileFields.map((field, index) => (
                            <li key={index} className="flex items-center gap-3">
                                <span
                                    className={`w-5 h-5 rounded-full flex items-center justify-center 
                    ${field.value ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                                >
                                    {field.value ? (
                                        <CheckIcon className="w-3 h-3" />
                                    ) : (
                                        <XMarkIcon className="w-3 h-3" />
                                    )}
                                </span>
                                <span className={`text-lg font-medium ${field.value ? 'text-emerald-800' : 'text-rose-800'}`}>
                                    {field.label}
                                </span>
                                {field.value && (
                                    <span className="ml-auto text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">
                                        Verified
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className={`text-center mt-6 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out ${percentage === 100 ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                        <div className="flex items-center justify-center gap-2">
                            {percentage === 100 ? (
                                <>
                                    <div className="text-2xl">🎉</div>
                                    <div>
                                        <p className="font-medium text-emerald-800">Profile Complete!</p>
                                        <p className="text-sm text-emerald-600">Great job! Your profile is fully optimized.</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-xl">⚠️</div>
                                    <div>
                                        <p className="font-medium text-amber-800">Profile {percentage}% Complete</p>
                                        <p className="text-sm text-amber-600">Fill in missing details to improve visibility.</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {percentage < 100 && (
                            <button className="mt-3 px-4 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors duration-200 font-medium">
                                Complete Profile
                            </button>
                        )}
                    </div>
                </div>
                <div className='flex-[3] bg-white shadow-md p-8 rounded-3xl'>
                    <div className='flex gap-6 items-center mb-8 justify-between px-8'>
                        <div className='flex items-center'>
                            <div className="relative">
                                <img
                                    style={{
                                        width: '112px',
                                        height: '112px',
                                        borderRadius: '9999px',
                                        objectFit: 'cover',
                                        border: '4px solid white',
                                        boxShadow: '0 0 15px rgba(59, 130, 246, 0.9)', // same as glow-md
                                        transition: 'filter 0.3s ease-in-out, transform 0.3s ease-in-out',
                                    }}
                                    src={
                                        userProfile?.jobSeekerProfile?.profileImage ||
                                        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
                                    }
                                    alt="Profile"
                                />


                                <span className="absolute top-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                            </div>
                            <div className='ml-4'>
                                <h2 className="text-2xl font-bold">{userProfile?.name || "Your Name"}</h2>
                                <p className="text-gray-500">{userProfile?.email || "your.email@example.com"}</p>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            {/* <PiDotsThreeCircleVertical size={36} /> */}

                            <div className="dropdown dropdown-start">
                                {

                                }
                                <button
                                    tabIndex={0}
                                    className="bg-white shadow rounded-full p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                >
                                    <BsThreeDotsVertical size={18} />
                                </button>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-base-100 rounded-box w-36 p-2 shadow"
                                >
                                    <li>
                                        <button onClick={() => setEditMode(true)} >
                                            Edit
                                        </button>
                                    </li>
                                    <li>
                                        <button >
                                            Delete account
                                        </button>
                                    </li>
                                </ul>
                            </div>


                        </div>
                    </div>
                    <form className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Personal Information Section */}
                        <fieldset className="md:col-span-2 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <legend className="px-4 text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full py-1 px-6 border border-gray-100">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    Personal Information
                                </span>
                            </legend>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-1">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mr-2">Required</span>
                                        Full Name
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="text"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                defaultValue={userProfile?.name || ""}
                                                required
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.name ? userProfile.name.toUpperCase() : "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full mr-2">Required</span>
                                        Email
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                defaultValue={userProfile?.email || ""}
                                                required
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.email || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <input
                                                id="phone"
                                                type="tel"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                defaultValue={userProfile?.jobSeekerProfile?.phoneNumber || ""}
                                                placeholder="+1 (123) 456-7890"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.jobSeekerProfile?.phoneNumber || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-1">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        Location
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <input
                                                id="location"
                                                type="text"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                defaultValue={userProfile?.location || ""}
                                                placeholder="City, Country"
                                            />
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.location || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* Professional Information Section */}
                        <fieldset className="md:col-span-2 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <legend className="px-4 text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full py-1 px-6 border border-gray-100">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                    </svg>
                                    Professional Information
                                </span>
                            </legend>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Role */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Current Role</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            className="block w-full rounded-lg border-gray-300 bg-gray-100 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                            defaultValue={userProfile?.role || ""}
                                            disabled
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.role || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Experience Level */}
                                <div className="space-y-1">
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                                        Experience Level
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <select
                                                id="experience"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border appearance-none bg-white"
                                                defaultValue={userProfile?.experienceLevel || ""}
                                            >
                                                <option value="">Select level</option>
                                                <option value="Entry-level">Entry-level</option>
                                                <option value="Mid-level">Mid-level</option>
                                                <option value="Senior">Senior</option>
                                                <option value="Lead">Lead</option>
                                                <option value="Executive">Executive</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.experienceLevel || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Skills */}
                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                                        Skills
                                    </label>
                                    {editMode ? (
                                        <div>
                                            <div className="relative">
                                                <input
                                                    id="skills"
                                                    type="text"
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                                    defaultValue={userProfile?.skills?.join(", ") || ""}
                                                    placeholder="React, Node.js, Python, etc."
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                                </svg>
                                                Separate skills with commas
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.skills?.length ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {userProfile.skills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="rounded-full bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1 text-sm font-medium text-blue-800 flex items-center"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* Job Preferences Section */}
                        <fieldset className="md:col-span-2 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <legend className="px-4 text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full py-1 px-6 border border-gray-100">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                    Job Preferences
                                </span>
                            </legend>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Preferred Roles */}
                                <div className="space-y-1">
                                    <label htmlFor="preferredRoles" className="block text-sm font-medium text-gray-700">
                                        Preferred Roles
                                    </label>
                                    {editMode ? (
                                        <input
                                            id="preferredRoles"
                                            type="text"
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                            defaultValue={userProfile?.jobSeekerProfile?.roles || ""}
                                            placeholder="Frontend Developer, Full Stack Engineer, etc."
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.jobSeekerProfile?.roles || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Preferred Job Titles */}
                                <div className="space-y-1">
                                    <label htmlFor="preferredTitles" className="block text-sm font-medium text-gray-700">
                                        Preferred Job Titles
                                    </label>
                                    {editMode ? (
                                        <div>
                                            <input
                                                id="preferredTitles"
                                                type="text"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                                defaultValue={userProfile?.jobSeekerProfile?.preferredJobTitles?.join(", ") || ""}
                                                placeholder="Software Engineer, Product Manager, etc."
                                            />
                                            <p className="mt-2 text-xs text-gray-500 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                                </svg>
                                                Separate with commas
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.jobSeekerProfile?.preferredJobTitles?.length ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {userProfile.jobSeekerProfile.preferredJobTitles.map((title, index) => (
                                                        <span
                                                            key={index}
                                                            className="rounded-full bg-gradient-to-r from-purple-100 to-purple-200 px-3 py-1 text-sm font-medium text-purple-800 flex items-center"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            {title.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Preferred Locations */}
                                <div className="space-y-1 md:col-span-2">
                                    <label htmlFor="preferredLocations" className="block text-sm font-medium text-gray-700">
                                        Preferred Locations
                                    </label>
                                    {editMode ? (
                                        <div>
                                            <input
                                                id="preferredLocations"
                                                type="text"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                                defaultValue={userProfile?.jobSeekerProfile?.preferredLocations?.join(", ") || ""}
                                                placeholder="Remote, New York, London, etc."
                                            />
                                            <p className="mt-2 text-xs text-gray-500 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                                </svg>
                                                Separate with commas
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.jobSeekerProfile?.preferredLocations?.length ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {userProfile.jobSeekerProfile.preferredLocations.map((location, index) => (
                                                        <span
                                                            key={index}
                                                            className="rounded-full bg-gradient-to-r from-green-100 to-green-200 px-3 py-1 text-sm font-medium text-green-800 flex items-center"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                            </svg>
                                                            {location.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* Education Section */}
                        <fieldset className="md:col-span-2 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <legend className="px-4 text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full py-1 px-6 border border-gray-100">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                    </svg>
                                    Education
                                </span>
                            </legend>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                {/* University */}
                                <div className="space-y-1">
                                    <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                                        University
                                    </label>
                                    {editMode ? (
                                        <input
                                            id="university"
                                            type="text"
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                            defaultValue={userProfile?.jobSeekerProfile?.education?.university || ""}
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.jobSeekerProfile?.education?.university || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Degree */}
                                <div className="space-y-1">
                                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
                                        Degree
                                    </label>
                                    {editMode ? (
                                        <input
                                            id="degree"
                                            type="text"
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                            defaultValue={userProfile?.jobSeekerProfile?.education?.degree || ""}
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.jobSeekerProfile?.education?.degree || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Field of Study */}
                                <div className="space-y-1">
                                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
                                        Field of Study
                                    </label>
                                    {editMode ? (
                                        <input
                                            id="fieldOfStudy"
                                            type="text"
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                            defaultValue={userProfile?.jobSeekerProfile?.education?.fieldOfStudy || ""}
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.jobSeekerProfile?.education?.fieldOfStudy || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Graduation Year */}
                                <div className="space-y-1">
                                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                                        Graduation Year
                                    </label>
                                    {editMode ? (
                                        <input
                                            id="graduationYear"
                                            type="number"
                                            min="1900"
                                            max={new Date().getFullYear() + 5}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                            defaultValue={userProfile?.jobSeekerProfile?.education?.graduationYear || ""}
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="text-lg font-medium text-gray-800">
                                                {userProfile?.jobSeekerProfile?.education?.graduationYear || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* Social Links Section */}
                        <fieldset className="md:col-span-2 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <legend className="px-4 text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full py-1 px-6 border border-gray-100">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                    </svg>
                                    Social Links
                                </span>
                            </legend>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* LinkedIn */}
                                <div className="space-y-1">
                                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                                        LinkedIn
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="linkedin"
                                                type="url"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                defaultValue={userProfile?.jobSeekerProfile?.socialLinks?.linkedin || ""}
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.jobSeekerProfile?.socialLinks?.linkedin ? (
                                                <a
                                                    href={userProfile.jobSeekerProfile.socialLinks.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:underline font-medium"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                    LinkedIn Profile
                                                </a>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* GitHub */}
                                <div className="space-y-1">
                                    <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                                        GitHub
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                                </svg>
                                            </div>
                                            <input
                                                id="github"
                                                type="url"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                defaultValue={userProfile?.jobSeekerProfile?.socialLinks?.github || ""}
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.jobSeekerProfile?.socialLinks?.github ? (
                                                <a
                                                    href={userProfile.jobSeekerProfile.socialLinks.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-gray-800 hover:underline font-medium"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                                    </svg>
                                                    GitHub Profile
                                                </a>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Portfolio */}
                                <div className="space-y-1">
                                    <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                                        Portfolio
                                    </label>
                                    {editMode ? (
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                id="portfolio"
                                                type="url"
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                defaultValue={userProfile?.jobSeekerProfile?.socialLinks?.portfolio || ""}
                                                placeholder="https://yourportfolio.com"
                                            />
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.jobSeekerProfile?.socialLinks?.portfolio ? (
                                                <a
                                                    href={userProfile.jobSeekerProfile.socialLinks.portfolio}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-purple-600 hover:underline font-medium"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                                    </svg>
                                                    Portfolio Website
                                                </a>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* Additional Information Section */}
                        <fieldset className="md:col-span-2 space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <legend className="px-4 text-xl font-semibold text-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full py-1 px-6 border border-gray-100">
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                    </svg>
                                    Additional Information
                                </span>
                            </legend>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Resume */}
                                <div className="space-y-1">
                                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                                        Resume
                                    </label>
                                    {editMode ? (
                                        <div className="flex items-center">
                                            <div className="relative flex-grow">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="resume"
                                                    type="url"
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border pl-10"
                                                    defaultValue={userProfile?.jobSeekerProfile?.resume || ""}
                                                    placeholder="https://example.com/resume.pdf"
                                                />
                                            </div>
                                            {userProfile?.jobSeekerProfile?.resume && (
                                                <a
                                                    href={userProfile.jobSeekerProfile.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-2 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    View
                                                </a>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.jobSeekerProfile?.resume ? (
                                                <a
                                                    href={userProfile.jobSeekerProfile.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:underline font-medium"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    View Resume
                                                </a>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Certificates */}
                                <div className="space-y-1">
                                    <label htmlFor="certificates" className="block text-sm font-medium text-gray-700">
                                        Certificates
                                    </label>
                                    {editMode ? (
                                        <div>
                                            <div className="relative">
                                                <input
                                                    id="certificates"
                                                    type="text"
                                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                                    defaultValue={userProfile?.jobSeekerProfile?.certificates?.join(", ") || ""}
                                                    placeholder="AWS Certified, Google Analytics, etc."
                                                />
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500 flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                                </svg>
                                                Separate with commas
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            {userProfile?.jobSeekerProfile?.certificates?.length ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {userProfile.jobSeekerProfile.certificates.map((cert, index) => (
                                                        <span
                                                            key={index}
                                                            className="rounded-full bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-1 text-sm font-medium text-yellow-800 flex items-center"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            {cert.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-lg font-medium text-gray-800">Not provided</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Bio */}
                                <div className="space-y-1">
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                        Bio
                                    </label>
                                    {editMode ? (
                                        <div>
                                            <textarea
                                                id="bio"
                                                rows={4}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 px-4 py-3 border"
                                                defaultValue={userProfile?.jobSeekerProfile?.bio || ""}
                                                placeholder="Tell us about your professional background, skills, and interests..."
                                            />
                                            <p className="mt-2 text-xs text-gray-500">
                                                Max 500 characters
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                                            <p className="whitespace-pre-line text-lg text-gray-800">
                                                {userProfile?.jobSeekerProfile?.bio || "Not provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </fieldset>

                        {/* Submit Button */}
                        {editMode && (
                            <div className="mt-6 flex justify-end gap-4 md:col-span-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}

                                    className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile