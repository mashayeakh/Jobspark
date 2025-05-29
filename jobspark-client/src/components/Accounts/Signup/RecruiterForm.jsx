import React, { useContext, useState } from 'react'
import loc from "../../../assets/imgs/icons/location.svg"
// import uni from "../../../assets/imgs/icons/university.svg"
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { useLocation } from 'react-router'
import { AuthContext } from '../../Context/AuthContextProvider'
import { postMethod } from '../../Utils/Api'
// import { create } from 'flowbite-react/cli/commands/create'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RecruiterForm = () => {


    const [showPassword, setShowPassword] = useState(false)
    const [c_showPassword, setC_showPassword] = useState(false)

    const { createUser, loading, setLoading } = useContext(AuthContext);


    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const role = params.get("role") || "job_seeker"; // Default to "job_seeker" if no role is specified
    console.log("Role from URL:", role);


    const handleForm = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const password = e.target.password.value;
        const confirmPassword = e.target.confirm_password.value;

        if (password !== confirmPassword) {
            toast.error(`password do not match`);
            return;
        }

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            password,
            c_password: e.target.confirm_password.value,
            location: e.target.location.value,
            phone: e.target.phone.value,
            role,
            company_role: e.target.company_role.value,
            website: e.target.website.value,
        }



        console.log("Form Data:", formData);
        setLoading(true);


        try {

            const userCreation = await createUser(formData.email, formData.password)
            console.log("User creation response:", userCreation);

            const url = `http://localhost:5000/api/v1/user?role=${role}`
            const data = await postMethod(url, formData);
            if (data.success === true) {
                console.log("Success!!!");
                console.log("Data posted successfully for job seekers:", data);
                toast.success("Signup successful! 🎉");
                e.target.reset();
            } else {
                console.error("Error posting data for job seekers:", data);
                toast.error("Signup failed. Please try again.");
            }

        } catch (err) {
            console.log("Err ", err);
            if (err.code === "auth/email-already-in-use") {
                toast.error(`Email already taken.`);
            } else {
                toast.error(`Signup failed.${err.message} Please try again`);
            }
        } finally {
            setLoading(false);
            console.log("Loading state reset to false");
        }
    }




    return (
        <>

            <div className='pt-10'>
                <div className="max-w-2xl mx-auto  p-6 rounded-md shadow-2xl">
                    <p className="text-center my-5 text-xl font-semibold">
                        Get started with your account
                    </p>
                    <form onSubmit={handleForm} className="max-w-4xl mx-auto pb-5 px-10">
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
                                        name="name"
                                        required
                                        placeholder="Username"
                                        // pattern="[A-Za-z][A-Za-z0-9\-]*"
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
                                        name="email"
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
                                        name="password"
                                        placeholder="password"
                                        className="w-full"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
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
                            {/* {loading && <span className="loading loading-spinner loading-2xl"></span>} */}
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
                                        name="confirm_password"
                                        placeholder="confirm password"
                                        className="w-full"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
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
                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            background: "transparent",
                                            padding: 0,
                                            marginRight: "0.5em"
                                        }}
                                    >
                                        <img
                                            src={loc}
                                            alt="location icon"
                                            className="h-[1.5em] opacity-100"
                                            style={{ background: "transparent" }}
                                        />
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
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
                            <div className="flex-1">
                                <label className="input validator">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <g fill="none">
                                            <path
                                                d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                                                fill="currentColor"
                                            ></path>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                                                fill="currentColor"
                                            ></path>
                                        </g>
                                    </svg>
                                    <input
                                        type="tel"
                                        name='phone'
                                        className="tabular-nums"
                                        required
                                        placeholder="Phone"
                                        pattern="[0-9]*"
                                        minlength="10"
                                        maxlength="10"
                                        title="Must be 10 digits"
                                    />
                                </label>
                                <p className="validator-hint">Must be 10 digits</p>
                                {/* <div className="validator-hint hidden">Enter valid email address</div> */}
                            </div>
                        </div>


                        <div className="flex gap-6 mb-10 w-full">
                            <div className="flex-1">
                                <input
                                    list="browsers"
                                    name="company_role"
                                    placeholder="Pick a Role or write your own"
                                    className="input w-full select "
                                />

                                <datalist id="browsers">
                                    <option value="hiring_manager" />
                                    <option value="hr" />
                                    <option value="cto" />
                                    {/* <option value="Brave" /> */}
                                </datalist>
                            </div>
                        </div>
                        <div className="flex gap-38 w-full">

                            <textarea name="website" placeholder="www.google.com" className="textarea  w-full"></textarea>
                        </div>
                        <div className='pt-10'>
                            <button
                                className="btn btn-warning text-black mb-4 w-full py-3 text-sm flex justify-center items-center gap-2"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        <span>Creating your account...</span>
                                    </>
                                ) : (
                                    "Create a recruiter account"
                                )}
                            </button>
                            <button className="btn bg-white text-black w-full border-[#e5e5e5] text-sm">
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

export default RecruiterForm