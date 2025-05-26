import React, { useContext, useState } from 'react'
import loc from "../../../assets/imgs/icons/location.svg"
import uni from "../../../assets/imgs/icons/university.svg"
import { FaEyeSlash, FaRegEye } from 'react-icons/fa'
import { postMethod } from '../../Utils/Api'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useLocation } from 'react-router'
import { AuthContext } from '../../Context/AuthContextProvider'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const JobSeekingForm = () => {


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

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
            c_password: e.target.c_password.value,
            location: e.target.location.value,
            university: e.target.university.value,
            skills: e.target.skills.value,
            experienceLevel: e.target.experienceLevel.value,
            role,
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
                                        required
                                        name="name"
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
                                        name="email"
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
                            {loading && <span className="loading loading-spinner loading-2xl"></span>}

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
                                        name="c_password"
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
                                            src={uni}
                                            alt="university icon"
                                            className="h-[1.5em] opacity-100"
                                            style={{ background: "transparent" }}
                                        />
                                    </span>
                                    <input
                                        type="text"
                                        name="university"
                                        required
                                        placeholder="Aiub"
                                        className="w-full"
                                        style={{ background: "transparent" }}
                                    />
                                </label>
                                {/* <div className="validator-hint hidden">Enter valid email address</div> */}
                            </div>
                        </div>

                        <div className="flex gap-6 mb-10">
                            {/* Username Field */}
                            <div className="flex-1">
                                <input
                                    list="roles"
                                    name="roles"
                                    placeholder="Pick a Role or write your own"
                                    className=" w-full select "
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
                                <select defaultValue="Skills" name="skills" className="select ">
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
                                <select defaultValue="Experience Level" name='experienceLevel' className="select">
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
                    <ToastContainer position="top-right" autoClose={3000} />

                </div >
            </div >
        </>

    )
}

export default JobSeekingForm