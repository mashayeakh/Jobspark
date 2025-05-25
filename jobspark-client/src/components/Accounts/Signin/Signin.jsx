import React, { useState } from 'react'
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { Link } from 'react-router'

const Signin = () => {


    const [showPassword, setShowPassword] = useState(false)
    // const [c_showPassword, setC_showPassword] = useState(false)


    return (
        <>
            <div className='pt-20'>
                <div className="max-w-sm mx-auto  p-6 rounded-md shadow-2xl">
                    <p className="text-center my-5 text-xl font-semibold">
                        Sign in
                    </p>
                    <form className="max-w-4xl mx-auto pb-5 px-10">
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
                                        required
                                        placeholder="mail@site.com"
                                        className="w-full"
                                    />
                                </label>
                                <div className="validator-hint hidden">Enter valid email address</div>
                            </div>
                        </div>
                        <div className="flex gap-6 relative py-7">
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
                            <p>Not Registered ?
                                <Link to="/signup" className='text-blue-600 hover:text-blue-800'>

                                    <span className='text-red-800 ml-2'>Register here</span>
                                </Link>
                            </p>
                        </div>
                        <div>
                            <button className='btn btn-primary w-full py-3 text-lg'>
                                Join Now
                            </button>
                        </div>
                        <div className='pt-5'>
                            <button className="btn bg-white text-black w-full border-[#e5e5e5]">
                                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                Continue with Google
                            </button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}

export default Signin