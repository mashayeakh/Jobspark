import React, { useContext, useEffect, useState } from 'react'
import { ActiveJobsContext } from '../../../../Context/ActiveJobsContextProvider';
import { AuthContext } from '../../../../Context/AuthContextProvider';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router';

const JobLayout = () => {

    const { fetchAllActiveJobs } = useContext(ActiveJobsContext);
    const { loading } = useContext(AuthContext);
    const [showActiveJob, setShowActiveJob] = useState([])

    useEffect(() => {
        const showAllActiveJobs = async () => {
            try {
                const url = "http://localhost:5000/api/v1/";
                const fetchedData = await fetchAllActiveJobs(url);
                console.log("Fetched Data ", fetchedData);
                setShowActiveJob(fetchedData);
            } catch (err) {
                console.log("Err from job layout", err.message);
            }
        }
        showAllActiveJobs();
    }, [fetchAllActiveJobs])


    console.log("Show Active Jobs", showActiveJob);
    console.log("Show Active Jobs", showActiveJob.data);




    console.log(Array.isArray(showActiveJob));




    console.log(typeof (showActiveJob));
    const showActiveJob_Arr = Object.keys(showActiveJob);
    // console.log("Type of arrFromObj", typeof (arrFromObj));
    console.log(Array.isArray(showActiveJob_Arr));
    console.log("showActiveJob_Arr", showActiveJob_Arr);


    return (
        <>
            <div className=''>
                <div className="px-3 pb-4">
                    <p className="text-xl text-gray-700">Showsing Reult: {showActiveJob.data?.length}</p>
                </div>
                {
                    showActiveJob.data && showActiveJob.data.length > 0 ?
                        showActiveJob.data.map(showJobs => (
                            <Link to={`/job/${showJobs?._id}`}>
                                <div className="w-full p-4 shadow-2xl bg-white border border-gray-200 rounded-lg sm:p-8 transition delay-150 duration-200 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer mb-8 ">
                                    <div className='flex items-start justify-between'>
                                        <div className='flex gap-4 items-center'>
                                            <figure className="">
                                                <img
                                                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                                    alt="Shoes"
                                                    className="rounded-xl w-24 h-20" />
                                            </figure>
                                            <div>
                                                <h5 className="mb-2 text-3xl font-bold ">{showJobs?.jobTitle}</h5>
                                                <div className='flex text-gray-600 text-lg gap-4'>
                                                    <p className='font-bold'>{showJobs?.companyName} </p>

                                                    <p className="ml-2 flex items-center gap-1" >
                                                        <HiOutlineLocationMarker size={24} />
                                                        {showJobs?.location} </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='text-2xl font-bold'>$ {showJobs?.salary}</p>
                                        </div>
                                    </div>
                                    <div className='pt-8'>
                                        <p className="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
                                            {showJobs?.description}
                                        </p>
                                        <div>
                                            <div className="bg-white">
                                                {
                                                    showJobs?.employeeType === "Full time" ?
                                                        <div className="badge badge-primary badge-lg  mr-4">{showJobs?.employeeType}</div> : showJobs?.employeeType === "Part time" ? <div className="badge badge-secondary badge-lg mr-4">Part time</div> : <div className="badge badge-warning badge-lg  mr-4">Internship</div>
                                                }
                                                <div className="badge badge-warning badge-lg  mr-4">Internship</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )) : <div>
                            <p>
                                No Jobs found
                            </p>
                        </div>
                }
            </div >

        </>
    )
}

export default JobLayout 