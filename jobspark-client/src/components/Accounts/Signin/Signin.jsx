import React, { useContext, useState } from 'react'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'
import { AuthContext } from '../../Context/AuthContextProvider'
import { patchMethod } from '../../Utils/Api'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Player } from '@lottiefiles/react-lottie-player'
import signupAnimation from "../../../assets/imgs/animations/signup.json"
// import signupAnimation from "../../assets/imgs/animations/signup.json"


const Signin = () => {


    const [showPassword, setShowPassword] = useState(false)
    // const [c_showPassword, setC_showPassword] = useState(false)
    const { loginUser, loading, setLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginUser = async (e) => {
        e.preventDefault();
        const loginData = {
            email: e.target.email.value.trim(),
            password: e.target.password.value.trim(),
        }
        console.log("Login Data ", loginData);
        setLoading(true);
        try {
            const loggedInUser = await loginUser(loginData.email, loginData.password);
            console.log("Logged in user", loggedInUser);

            //grab the time
            console.log("time of the logged in user ", loggedInUser?.user?.metadata?.lastSignInTime);

            const currDate = new Date(loggedInUser?.user?.metadata?.lastSignInTime).toLocaleString();
            console.log("Curr Data ", currDate);

            const url = "http://localhost:5000/api/v1/u"

            const wrappedData = {
                email: loginData.email,
                currDate,
            }

            const result = await patchMethod(url, wrappedData);
            if (result.success === true) {
                // alert("Success");
                console.log("Result ", result);
                toast.success("Signing successful! 🎉");
                e.target.reset();
                navigate("/");
            } else {
                console.error("Error posting data for job seekers:", wrappedData);
                toast.error("Signup failed. Please try again.");
            }

        } catch (err) {
            console.log("ERR ", err);
            toast.error(`Signup failed.${err.message} Please try again`);
        } finally {
            setLoading(false);
            console.log("Loading state reset to false");
        }
    }

    const handleFormRecruiter = () => {

        const modal = document.getElementById("my_modal_1");
        if (modal) {
            modal.close();
        }
        navigate("/recruiter-form?role=recruiter");
    }


    const handleJobSeekingForm = () => {

        const modal = document.getElementById("my_modal_1");
        if (modal) {
            modal.close();
        }
        navigate("/job-seeking-form");
    }

    return (
        <>
            <div className='pt-20'>
                <div className="max-w-sm mx-auto  p-6 rounded-md shadow-2xl">
                    <p className="text-center my-5 text-xl font-semibold">
                        Sign in
                    </p>
                    <form onSubmit={handleLoginUser} className="max-w-4xl mx-auto pb-5 px-10">
                        <div className="flex gap-6">
                            {/* Username Field */}


                            {/* Email Field */}
                            <div className="flex-1">
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
                                <div className="validator-hint hidden">Enter valid email address</div>
                                {/* {loading && <span className="loading loading-spinner flex justify-center loading-2xl"></span>} */}
                            </div>
                        </div>
                        <div className="flex gap-6 relative pt-7 pb-5">
                            {/* Password Field */}
                            <label className="input validator w-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
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
                            <span onClick={() => setShowPassword(!showPassword)} className='absolute right-5 top-10 cursor-pointer'>
                                {showPassword ? <FaRegEye className='text-lg' /> : <FaEyeSlash className='text-lg' />}
                            </span>
                        </div>
                        {/* confirm password Field */}
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
                        <div>
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

                        </div>
                        <div className='pt-5'>
                            <button className="btn bg-white text-black w-full border-[#e5e5e5]">
                                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                Continue with Google
                            </button>
                        </div>
                    </form>
                    <ToastContainer position="top-right" autoClose={3000} />
                </div >
            </div >
        </>
    )
}

export default Signin