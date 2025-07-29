import React, { useContext, useState } from 'react'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'
import { AuthContext } from '../../Context/AuthContextProvider'
import { patchMethod } from '../../Utils/Api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Player } from '@lottiefiles/react-lottie-player'
import signupAnimation from "../../../assets/imgs/animations/signup.json"

const Signin = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("job_seeker")

    const { loginUser, loading, setLoading, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginUser = async (e) => {
        e.preventDefault();
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();

        setLoading(true);
        try {
            if (role === "admin") {
                // Admin login with backend endpoint
                const response = await fetch("http://localhost:5000/api/v1/admin/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                console.log("DATA ", data);

                if (response.ok || data.success) {
                    toast.success("Admin signed in successfully 🎉");

                    const adminUser = {
                        role: "admin",
                        email,
                        _id: data.admin?._id,
                        name: data.admin?.name || "Admin",
                    };

                    // ✅ Save to context AND localStorage
                    setUser(adminUser);
                    localStorage.setItem("adminData", JSON.stringify(adminUser));

                    navigate("/admin/dashboard");
                } else {
                    throw new Error(data.message || "Admin login failed");
                }
            } else {
                // Firebase login for job_seeker or recruiter
                const loggedInUser = await loginUser(email, password);
                const currDate = new Date(loggedInUser?.user?.metadata?.lastSignInTime).toLocaleString();

                const wrappedData = {
                    email,
                    currDate,
                };

                const url = "http://localhost:5000/api/v1/u";
                const result = await patchMethod(url, wrappedData);

                if (result.success === true) {
                    toast.success("Signed in successfully! 🎉");
                    e.target.reset();
                    navigate("/");
                } else {
                    throw new Error("Signin failed. Please try again.");
                }
            }
        } catch (err) {
            toast.error(`Signin failed. ${err?.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }

    };

    const handleFormRecruiter = () => {
        const modal = document.getElementById("my_modal_1");
        if (modal) modal.close();
        navigate("/recruiter-form?role=recruiter");
    };

    const handleJobSeekingForm = () => {
        const modal = document.getElementById("my_modal_1");
        if (modal) modal.close();
        navigate("/job-seeking-form");
    };

    return (
        <>
            <div className='pt-20'>
                <div className="max-w-sm mx-auto p-6 rounded-md shadow-2xl">
                    <p className="text-center my-5 text-xl font-semibold">
                        Sign in
                    </p>
                    <form onSubmit={handleLoginUser} className="max-w-4xl mx-auto pb-5 px-10">
                        {/* Role Selector */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium text-gray-700">Login as</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="job_seeker">Job Seeker</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label className="input validator w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input
                                    type="email"
                                    name='email'
                                    required
                                    placeholder="mail@site.com"
                                    className="w-full"
                                />
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="mb-4 relative">
                            <label className="input validator w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    name='password'
                                    placeholder="password"
                                    className="w-full"
                                />
                            </label>
                            <span onClick={() => setShowPassword(!showPassword)} className='absolute right-5 top-4 cursor-pointer'>
                                {showPassword ? <FaRegEye className='text-lg' /> : <FaEyeSlash className='text-lg' />}
                            </span>
                        </div>

                        {/* Signup Link */}
                        <div className='mb-4 text-center'>
                            <p className="text-sm text-gray-500 mx-auto">
                                Don't have an account?
                                <span className="text-red-800 cursor-pointer hover:underline ml-2 font-bold" onClick={() => document.getElementById('my_modal_1').showModal()}>
                                    Signup
                                </span>
                            </p>
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box text-center">
                                    <Player autoplay loop src={signupAnimation} style={{ height: 200, width: 200 }} />
                                    <div className="modal-action justify-around mt-4">
                                        <button onClick={handleFormRecruiter} className="link link-primary">
                                            Sign up as a Recruiter
                                        </button>
                                        <button onClick={handleJobSeekingForm} className="link link-primary">
                                            Sign up as a Job Seeker
                                        </button>
                                    </div>
                                </div>
                            </dialog>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                className="btn btn-primary w-full py-3 text-lg flex justify-center items-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    "Join Now"
                                )}
                            </button>
                        </div>

                        {/* Google Button */}
                        <div className='pt-5'>
                            <button className="btn bg-white text-black w-full border-[#e5e5e5]">
                                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                Continue with Google
                            </button>
                        </div>
                    </form>
                    <ToastContainer position="top-right" autoClose={3000} />
                </div>
            </div>
        </>
    )
}

export default Signin;
