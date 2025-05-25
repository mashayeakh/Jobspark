import React, { useState } from 'react'
import location from "../../../assets/imgs/icons/location.svg"
import uni from "../../../assets/imgs/icons/university.svg"
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'

const Signup = () => {


    const [showPassword, setShowPassword] = useState(false)
    const [c_showPassword, setC_showPassword] = useState(false)


    return (
        <>
            <div className='pt-10'>
                <div className="max-w-2xl mx-auto  p-6 rounded-md shadow-2xl">
                    <p className="text-center my-5 text-xl font-semibold">
                        Get started with your account
                    </p>
                    <form className="max-w-4xl mx-auto pb-5 px-10">
                        <div className="flex gap-6">
                            {/* Username Field */}
                            <div className="flex-1">
                                <label className="input validator w-full">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </g>
                                    </svg>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Username"
                                        pattern="[A-Za-z][A-Za-z0-9\-]*"
                                        minLength="3"
                                        maxLength="30"
                                        title="Only letters, numbers or dash"
                                        className="w-full"
                                    />
                                </label>
                                <p className="validator-hint">
                                    Must be 3 to 30 characters
                                    <br />containing only letters, numbers or dash
                                </p>
                            </div>

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
                        <div className="flex gap-6">
                            {/* Password Field */}
                            <div className="flex-1">
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
                                    {/* <span onClick={() => setShowPass(!showPass)} className='absolute top-[60%] right-3 text-lg cursor-pointer'>
                                        {showPass ? <FaEye /> : <FaEyeSlash />}
                                    </span> */}
                                    <span onClick={() => setShowPassword(!showPassword)} className='cursor-pointer' >
                                        {showPassword ? <FaRegEye /> : < FaEyeSlash />}
                                    </span>
                                </label>
                                <p className="validator-hint">
                                    Must be 3 to 30 characters
                                    <br />containing only letters, numbers or dash
                                </p>
                            </div>

                            {/* confirm password Field */}
                            <div className="flex-1">
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
                                        type={c_showPassword ? "text" : "password"}
                                        required
                                        placeholder="confirm password"
                                        className="w-full"
                                    />
                                    {/* <span onClick={() => setShowPass(!showPass)} className='absolute top-[60%] right-3 text-lg cursor-pointer'>
                                        {showPass ? <FaEye /> : <FaEyeSlash />}
                                    </span> */}
                                    <span onClick={() => setC_showPassword(!c_showPassword)} className='cursor-pointer' >
                                        {c_showPassword ? <FaRegEye /> : < FaEyeSlash />}
                                    </span>
                                </label>
                                <p className="validator-hint">
                                    Must be 3 to 30 characters
                                    <br />containing only letters, numbers or dash
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            {/* location Field */}
                            <div className="flex-1">
                                <label className="input validator w-full">
                                    <img src={location} alt="location icon" className="h-[1.5em] opacity-100" />

                                    <input
                                        type="text"
                                        required
                                        placeholder="location"
                                        pattern="[A-Za-z][A-Za-z0-9\-]*"
                                        minLength="3"
                                        maxLength="30"
                                        title="Only letters, numbers or dash"
                                        className="w-full"
                                    />
                                </label>
                                <p className="validator-hint">
                                    Must be 3 to 30 characters
                                    <br />containing only letters, numbers or dash
                                </p>
                            </div>

                            {/* university Field */}
                            <div className="flex-1">
                                <label className="input validator w-full">
                                    <img src={uni} alt="location icon" className="h-[1.5em]  opacity-100" />

                                    <input
                                        type="text"
                                        required
                                        placeholder="Aiub"
                                        className="w-full"
                                    />
                                </label>
                                {/* <div className="validator-hint hidden">Enter valid email address</div> */}
                            </div>
                        </div>

                        <div className="flex gap-6 mb-10">
                            {/* Username Field */}
                            <div className="flex-1">
                                <input
                                    list="browsers"
                                    name="browser"
                                    placeholder="Pick a Role or write your own"
                                    className="input w-full select placeholder-white"
                                />

                                <datalist id="browsers">
                                    <option value="Chrome" />
                                    <option value="Firefox" />
                                    <option value="Safari" />
                                    <option value="Brave" />
                                </datalist>
                            </div>

                            {/* Email Field */}
                            <div className="flex-1">
                                <select defaultValue="Skills" className="select ">
                                    <option disabled={true}>Skills</option>
                                    <option>Light mode</option>
                                    <option>Dark mode</option>
                                    <option>System</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-38 ">
                            {/* Username Field */}
                            <div className="flex-1">
                                <select defaultValue="Experience Level" className="select">
                                    <option disabled={true}>Experience Level</option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>
                            <button className='btn btn-primary'>
                                Create an User
                            </button>
                        </div>
                        <div className='pt-10'>
                            <button className="btn bg-white text-black w-full border-[#e5e5e5]">
                                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
                                Continue with Google
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </>
    )
}

export default Signup