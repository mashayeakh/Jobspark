import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../../../Context/AuthContextProvider';
import { TotalApplicationContext } from '../../../../../Context/TotalApplicationProvider';
import Google from '../../../../../../assets/imgs/companyLogo/google.png';
import { FaCode, FaSort } from 'react-icons/fa';

const TotalApplicants = () => {

    const { appliedInfo, allApplicantsInfo } = useContext(TotalApplicationContext);
    const { user } = useContext(AuthContext);
    const [showDataInfo, setShowDataInfo] = useState({});
    const [showAllApplicantsInfo, setShowAllApplicantsInfo] = useState({});


    console.log("Uer id ", user?._id);


    const showInfo = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applications`
        try {
            const data = await appliedInfo(url);
            if (data.status === true) {
                setShowDataInfo(data);
                console.log("Data from total Application", data);
            } else {
                console.log("Err form total Application",);
            }
        } catch (err) {
            console.log("Err from total Application", err.message);
        }
    }


    console.log("Sow Data Info", showDataInfo);
    const totalApplicants = showDataInfo.data?.jobs.map(j => j?.applicantsCount || 0).reduce((acc, crrVal) => acc + crrVal, 0)
    // console.log("Sow Data Info000000000", showDataInfo.data?.jobs.map(j => j?.applicantsCount).reduce((acc, crrVal) => acc + crrVal, 0));
    console.log("Total Applicants ", totalApplicants);


    //?  get all the all user to show in table.

    const showAllInfo = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/all-applicants-info`
        try {
            const data = await allApplicantsInfo(url);
            if (data.status === true) {
                setShowAllApplicantsInfo(data);
                console.log("All Applications ", data);
            } else {
                console.log("Err form total Application",);
            }
        } catch (err) {
            console.log("Err from total Application", err.message);
        }
    }

    useEffect(() => {
        if (!user?._id) return;
        showInfo();
        showAllInfo();
    }, [user?._id])

    console.log("Show all Applicants Info", showAllApplicantsInfo);

    return (

        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div>

                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Total Applications: <span className="text-blue-600">{totalApplicants || 0}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <img src={Google} alt="Company Logo" className="w-12 mb-3" />
                            <h3 className="text-lg font-semibold mb-1 text-gray-700">Total Applications</h3>
                            <span className="text-2xl font-bold text-blue-600">{totalApplicants || 0}</span>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <img src={Google} alt="Company Logo" className="w-12 mb-3" />
                            <h3 className="text-lg font-semibold mb-1 text-gray-700">New Today</h3>
                            <span className="text-2xl font-bold text-green-600">7</span>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <img src={Google} alt="Company Logo" className="w-12 mb-3" />
                            <h3 className="text-lg font-semibold mb-1 text-gray-700">Shortlisted</h3>
                            <span className="text-2xl font-bold text-yellow-600">123</span>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
                            <img src={Google} alt="Company Logo" className="w-12 mb-3" />
                            <h3 className="text-lg font-semibold mb-1 text-gray-700">Rejected</h3>
                            <span className="text-2xl font-bold text-red-600">123</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 ">
                        <label className="flex items-center rounded-lg px-3 py-2 w-full md:w-1/2">
                            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="search" required placeholder="Search" className="outline-none w-full bg-transparent" />
                        </label>
                        <div className="flex flex-row items-center gap-2 whitespace-nowrap max-w-4xl w-full md:w-1/3">
                            <label htmlFor="filter" className="text-gray-600 font-medium">Filter by</label>
                            <select className="select select-bordered w-full">
                                <option>All</option>
                                <option>Chrome</option>
                                <option>FireFox</option>
                                <option>Safari</option>
                            </select>
                        </div>
                        <div className="flex flex-row items-center gap-2 whitespace-nowrap w-full md:w-1/3">
                            <label htmlFor="" className="text-gray-600 font-medium">Status</label>
                            <select className="select select-bordered w-full">
                                <option>All</option>
                                <option>Chrome</option>
                                <option>FireFox</option>
                                <option>Safari</option>
                            </select>
                        </div>
                        {/* Sort By dropdown in one line */}
                        <div className="dropdown dropdown-end flex items-center">
                            <div tabIndex={0} role="button" className="btn btn-ghost rounded-lg text-sm flex items-center gap-2">
                                <FaSort size={24} />
                                Sort By
                            </div>
                            <ul tabIndex={0} className="menu dropdown-content bg-base-200 rounded-box z-10 mt-2 w-32 p-2 shadow">
                                <li><a>Newest</a></li>
                                <li><a>Oldest</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <h2 className='text-3xl'>Applicants List</h2>
                        <table className="table table-lg">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Job</th>
                                    <th>company</th>
                                    <th>location</th>
                                    <th>Last Login</th>
                                    <th>Favorite Color</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>1</th>
                                    <td>Cy Ganderton</td>
                                    <td>Quality Control Specialist</td>
                                    <td>Littel, Schaden and Vandervort</td>
                                    <td>Canada</td>
                                    <td>12/16/2020</td>
                                    <td>Blue</td>
                                </tr>
                                <tr>
                                    <th>2</th>
                                    <td>Hart Hagerty</td>
                                    <td>Desktop Support Technician</td>
                                    <td>Zemlak, Daniel and Leannon</td>
                                    <td>United States</td>
                                    <td>12/5/2020</td>
                                    <td>Purple</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Job</th>
                                    <th>company</th>
                                    <th>location</th>
                                    <th>Last Login</th>
                                    <th>Favorite Color</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>
            <div>



            </div>
        </>
    );
}

export default TotalApplicants