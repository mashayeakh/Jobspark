import React, { useContext, useEffect, useState } from 'react'
import { Flat, Heat, Nested } from '@alptugidin/react-circular-progress-bar'
import { UserContext } from '../../Context/UserContextProvider';
import { AuthContext } from '../../Context/AuthContextProvider';



const getColorByPercentage = (percentage) => {
    if (percentage === 0) return '#ff4d4f';       // Red
    if (percentage > 0 && percentage < 40) return '#ff7a45'; // Slightly lighter red
    if (percentage < 70) return '#faad14';       // Orange
    return '#52c41a';                            // Green
};

const Profile = () => {

    const percentage = 30; // 🔥 Hardcoded for testing
    const color = getColorByPercentage(percentage);

    const { user } = useContext(AuthContext);

    console.log("USER ", user);
    const userId = user?._id;


    //fetch the profile
    const { getProfileById } = useContext(UserContext);
    const [userProfile, setUserProfile] = useState([]);

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


    return (
        <div className='bg-[#f8f9fa] min-h-screen'>
            <div className='flex px-12 py-8 gap-4'>
                {/* Profile Completion Card */}
                <div className='flex-[1] border bg-white shadow-md p-6 rounded-3xl flex flex-col items-center'>
                    <div className='text-2xl text-center mb-4 font-semibold'>
                        Complete your profile
                    </div>
                    <div className='border p-2 rounded-xl' style={{ width: 220 }}>
                        <Flat
                            progress={percentage}
                            range={{ from: 0, to: 100 }}
                            sign={{ value: '%', position: 'end' }}
                            showMiniCircle={true}
                            showValue={true}
                            sx={{
                                strokeColor: color,
                                barWidth: 12,
                                bgStrokeColor: '#f0f0f0',
                                bgColor: { value: '#e6f7ff', transparency: '30' },
                                shape: 'full',
                                strokeLinecap: 'round',
                                valueSize: 18,
                                valueWeight: 'bold',
                                valueColor: '#111',
                                valueFamily: 'Segoe UI',
                                textSize: 7,
                                textWeight: '500',
                                textColor: '#333',
                                textFamily: 'Segoe UI',
                                miniCircleColor: color,
                                miniCircleSize: 6,
                                valueAnimation: true,
                                intersectionEnabled: true,
                                loadingTime: 1000,
                            }}
                        />
                    </div>
                    <div className="text-sm text-gray-600 mt-3 text-center">
                        {percentage === 100
                            ? "🎉 Great job! Your profile is fully complete."
                            : `⚠️ Your profile is ${percentage}% complete. Fill in missing details to improve visibility.`}
                    </div>
                </div>
                {/* Profile Details Card */}
                <div className='flex-[3] border bg-white shadow-md p-8 rounded-3xl'>
                    <div className='flex gap-6 items-center mb-8'>
                        <div className="relative">
                            <img className="w-28 h-28 rounded-full object-cover border-4 border-gray-200" src={userProfile?.jobSeekerProfile?.profileImage || "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"} alt="Profile" />
                            <span className="absolute top-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{userProfile?.name || "Your Name"}</h2>
                            <p className="text-gray-500">{userProfile?.email || "your.email@example.com"}</p>
                        </div>
                    </div>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.name || ""}
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.email || ""}
                                disabled
                            />
                        </div>
                        {/* Phone Number */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.phoneNumber || ""}
                            />
                        </div>
                        {/* Location */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Location</label>
                            <input
                                type="text"
                                placeholder="Enter your location"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.location || ""}
                            />
                        </div>
                        {/* Role */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Role</label>
                            <input
                                type="text"
                                placeholder="Role"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.role || ""}
                                disabled
                            />
                        </div>
                        {/* Skills */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Skills</label>
                            <input
                                type="text"
                                placeholder="e.g. React, Node.js, Python"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.skills?.join(', ') || ""}
                            />
                        </div>
                        {/* Experience Level */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Experience Level</label>
                            <input
                                type="text"
                                placeholder="e.g. Junior, Mid, Senior"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.experienceLevel || ""}
                            />
                        </div>
                        {/* Roles (Preferred Roles) */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Preferred Roles</label>
                            <input
                                type="text"
                                placeholder="e.g. Frontend Developer"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.roles || ""}
                            />
                        </div>
                        {/* Preferred Job Titles */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Preferred Job Titles</label>
                            <input
                                type="text"
                                placeholder="e.g. Software Engineer, Backend Developer"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.preferredJobTitles?.join(', ') || ""}
                            />
                        </div>
                        {/* Preferred Locations */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Preferred Locations</label>
                            <input
                                type="text"
                                placeholder="e.g. Remote, New York"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.preferredLocations?.join(', ') || ""}
                            />
                        </div>
                        {/* Education */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">University</label>
                                <input
                                    type="text"
                                    placeholder="University"
                                    className="input input-bordered w-full"
                                    defaultValue={userProfile?.jobSeekerProfile?.education?.university || ""}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Degree</label>
                                <input
                                    type="text"
                                    placeholder="Degree"
                                    className="input input-bordered w-full"
                                    defaultValue={userProfile?.jobSeekerProfile?.education?.degree || ""}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Field of Study</label>
                                <input
                                    type="text"
                                    placeholder="Field of Study"
                                    className="input input-bordered w-full"
                                    defaultValue={userProfile?.jobSeekerProfile?.education?.fieldOfStudy || ""}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Graduation Year</label>
                                <input
                                    type="text"
                                    placeholder="Graduation Year"
                                    className="input input-bordered w-full"
                                    defaultValue={userProfile?.jobSeekerProfile?.education?.graduationYear || ""}
                                />
                            </div>
                        </div>
                        {/* Social Links */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">LinkedIn</label>
                            <input
                                type="url"
                                placeholder="LinkedIn profile link"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.socialLinks?.linkedin || ""}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">GitHub</label>
                            <input
                                type="url"
                                placeholder="GitHub profile link"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.socialLinks?.github || ""}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Portfolio</label>
                            <input
                                type="url"
                                placeholder="Portfolio or website link"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.socialLinks?.portfolio || ""}
                            />
                        </div>
                        {/* Resume */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Resume (URL)</label>
                            <input
                                type="url"
                                placeholder="Resume link"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.resume || ""}
                            />
                        </div>
                        {/* Certificates */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-1">Certificates (comma separated)</label>
                            <input
                                type="text"
                                placeholder="e.g. AWS Certified, PMP"
                                className="input input-bordered w-full"
                                defaultValue={userProfile?.jobSeekerProfile?.certificates?.join(', ') || ""}
                            />
                        </div>
                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 font-medium mb-1">Bio</label>
                            <textarea
                                placeholder="Tell us about yourself"
                                className="textarea textarea-bordered w-full"
                                rows={3}
                                defaultValue={userProfile?.jobSeekerProfile?.bio || ""}
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end mt-4">
                            <button type="submit" className="btn btn-primary px-8 py-2 rounded-lg text-white font-semibold">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile