import React, { useEffect, useState } from 'react'
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { Link, useLoaderData, useNavigate, useParams } from 'react-router';
import jobCategories from '../../../constants/JobCategories';

const CategoryJobs = () => {
    const data = useLoaderData();

    const category = jobCategories
    const d = useParams();

    const [cate, setCate] = useState([]);

    useEffect(() => {

        const filtered = category.filter(c => c.label !== d.categoryName)

        setCate(filtered);

        // Shuffle the filtered categories
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());

        // Take only the first 3
        setCate(shuffled.slice(0, 3));
    }, [category, d.categoryName])

    const rest = cate.map(c => c.label);


    const navigate = useNavigate();


    return (
        <div className="flex justify-center py-4">
            <div className="w-full px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Section - 30% */}
                    <div className="w-full md:w-[20%]">
                        <div className="h-full min-h-[300px] bg-gray-50 border border-dashed border-gray-300 rounded-lg ">
                            <h1 className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat quaerat nisi adipisci? Consequuntur impedit molestias deleniti eius inventore ea excepturi maiores ipsum laboriosam voluptates consequatur, nostrum nam? Porro, in est.</h1>
                        </div>
                    </div>
                    {/* Middle Section - 40% */}
                    <div className="w-full md:w-[60%] mx-auto">
                        <div className="px-4 pb-6">
                            <p className="text-2xl font-bold text-gray-800">
                                {`Showing ${data.data?.length || 0} Result${data.data?.length === 1 ? '' : 's'
                                    }`}
                            </p>
                        </div>

                        {data.data && data.data.length > 0 ? (
                            data.data.map((job) => (
                                <Link to={`/job/${job?._id}`} key={job?._id}>
                                    <div
                                        className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl
          transition-all duration-300 ease-in-out p-6 mb-6 cursor-pointer
          border border-gray-50 hover:border-blue-200"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                                            {/* Left: Logo and Info */}
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                                    alt="Company Logo"
                                                    className="w-16 h-16 rounded-xl object-cover ring-1 ring-gray-100"
                                                />
                                                <div>
                                                    <h2 className="text-xl font-extrabold text-gray-900 leading-snug">
                                                        {job?.jobTitle}
                                                    </h2>
                                                    <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                                                        <span className="font-medium text-gray-700">
                                                            {job?.companyName}
                                                        </span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="inline-flex items-center gap-1 text-gray-600">
                                                            <HiOutlineLocationMarker className="text-gray-400" size={16} />
                                                            {job?.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Salary */}
                                            <div className="text-left sm:text-right flex-shrink-0">
                                                <p className="text-xl font-bold text-emerald-600">${job?.salary}</p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mt-5 text-base text-gray-700 line-clamp-3 leading-relaxed">
                                            {job?.description}
                                        </div>

                                        {/* Badge */}
                                        <div className="mt-5">
                                            <span
                                                className={`inline-block px-4 py-2 rounded-full text-xs font-semibold tracking-wide
                ${job?.employeeType === 'Full time'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : job?.employeeType === 'Part time'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {job?.employeeType}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-12 rounded-xl bg-white shadow-sm mx-4">
                                <p className="text-lg font-medium">No jobs found.</p>
                            </div>
                        )}
                    </div>



                    {/* Right Section - 30% */}
                    <div className="w-full md:w-[20%]">
                        <div className="h-full min-h-[300px] bg-gray-50 border border-dashed border-gray-300 rounded-lg p-4">
                            <h1 className="text-lg font-semibold mb-4">Browse More</h1>

                            {cate.map((c, i) => (
                                <div key={i} className="card w-full bg-base-100 card-xs shadow-sm mb-4">
                                    <div className="card-body">
                                        <h2 className="card-title">{c.label}</h2>
                                        <p className="text-sm text-gray-500">Explore top jobs in {c.label} category</p>
                                        <div className="justify-end card-actions">
                                            <button
                                                onClick={() => navigate(`/category/${encodeURIComponent(c.label)}`)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryJobs