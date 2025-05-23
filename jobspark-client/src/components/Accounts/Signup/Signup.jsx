import React from 'react'
import location from "../../../assets/imgs/icons/location.svg"
import uni from "../../../assets/imgs/icons/university.svg"

const Signup = () => {
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
                                        type="password"
                                        required
                                        placeholder="password"
                                        // pattern="[A-Za-z][A-Za-z0-9\-]*"
                                        // minLength=""
                                        // maxLength="30"
                                        // title="Only letters, numbers or dash"
                                        className="w-full"
                                    />
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
                                        type="password"
                                        required
                                        placeholder="confirm password"
                                        className="w-full"
                                    />
                                </label>
                                {/* <div className="validator-hint hidden">Enter valid email address</div> */}
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
                        <div className="flex gap-6 mb-10">
                            {/* Username Field */}
                            <div className="flex-1">
                                <input
                                    list="browsers"
                                    name="browser"
                                    placeholder="Pick a browser or write your own"
                                    className="input  w-full select"
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
                                <select defaultValue="Color scheme" className="select ">
                                    <option disabled={true}>Color scheme</option>
                                    <option>Light mode</option>
                                    <option>Dark mode</option>
                                    <option>System</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-38 ">
                            {/* Username Field */}
                            <div className="flex-1">
                                <select defaultValue="Pick a color" className="select">
                                    <option disabled={true}>Pick a color</option>
                                    <option>Crimson</option>
                                    <option>Amber</option>
                                    <option>Velvet</option>
                                </select>
                            </div>
                            <button className='btn btn-primary'>
                                Create an User
                            </button>

                        </div>

                    </form>


                </div>


            </div >
        </>
    )
}

export default Signup