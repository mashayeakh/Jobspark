import React, { useContext, useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaCode, FaRegStar, FaSort } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlinePeople } from "react-icons/md";
import { RiBriefcase4Line } from "react-icons/ri";
import CompanyList from "./CompanyList";
import { CompanyContext } from "../../Context/CompanyContextProvider";

const CompanyFilter = () => {


    const { getCompany } = useContext(CompanyContext);

    // console.log("Get Company ", getCompany);
    const [data, setData] = useState([]);
    const fetch = async () => {
        const url = "http://localhost:5000/api/v1/companies";
        const values = await getCompany(url);
        setData(values);
        console.log("Data ", values);
    }

    useEffect(() => {
        fetch();
    }, [])

    console.log("Values", data);
    console.log("length - ", data.length);
    return (
        <>
            <div className="py-5">
                <label className="input">
                    <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input
                        type="search"
                        required
                        placeholder="Search by company and location"
                        className=""
                    />
                </label>
                <div className="flex gap-2 items-center pt-3">
                    <p className="font-bold text-3xl">All Companies</p>
                    <span className="text-gray-600 text-xl">({data.length})</span>
                </div>
                <div className="flex flex-col pt-3">
                    <div className="flex items-center justify-between pt-4">
                        <p className="text-2xl">Filter by:</p>
                        <div className="flex items-center gap-5">
                            <div className="  px-2">
                                <div className="flex items-stretch bg-white border border-gray-200 rounded-md shadow-sm">
                                    <div className="dropdown dropdown-end">
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className="btn btn-ghost rounded-field text-sm"
                                        >
                                            {" "}
                                            <HiOutlineLocationMarker size={24} />
                                            Location
                                        </div>
                                        <ul
                                            tabIndex={0}
                                            className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
                                        >
                                            <li>
                                                <a>Item 1</a>
                                            </li>
                                            <li>
                                                <a>Item 2</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-stretch bg-white border border-gray-200 rounded-md shadow-sm">
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost rounded-field text-sm"
                                    >
                                        {" "}
                                        <RiBriefcase4Line size={24} />
                                        Category
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-30 p-2 shadow-sm"
                                    >
                                        <li>
                                            <a>Item 1</a>
                                        </li>
                                        <li>
                                            <a>Item 2</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-stretch bg-white border border-gray-200 rounded-md shadow-sm">
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost rounded-field text-sm"
                                    >
                                        {" "}
                                        <FaCode size={25} />
                                        Technology
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-30 p-2 shadow-sm"
                                    >
                                        <li>
                                            <a>Item 1</a>
                                        </li>
                                        <li>
                                            <a>Item 2</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-stretch bg-white border border-gray-200 rounded-md shadow-sm">
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost rounded-field text-sm"
                                    >
                                        {" "}
                                        <MdOutlinePeople size={25} />
                                        Company Size
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-30 p-2 shadow-sm"
                                    >
                                        <li>
                                            <a>Item 1</a>
                                        </li>
                                        <li>
                                            <a>Item 2</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-stretch bg-white border border-gray-200 rounded-md shadow-sm">
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost rounded-field text-sm"
                                    >
                                        {" "}
                                        <FaRegStar size={24} />
                                        Ratings
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-30 p-2 shadow-sm"
                                    >
                                        <li>
                                            <a>Item 1</a>
                                        </li>
                                        <li>
                                            <a>Item 2</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-primary">Apply</button>
                            </div>
                        </div>
                        <div className="ml-auto">
                            <div className="flex items-stretch bg-white border border-gray-200 rounded-md shadow-sm">
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost rounded-field text-sm"
                                    >
                                        {" "}
                                        <FaSort size={24} />
                                        Sort By
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-30 p-2 shadow-sm"
                                    >
                                        <li>
                                            <a>Item 1</a>
                                        </li>
                                        <li>
                                            <a>Item 2</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CompanyList />
            </div>
        </>
    );
};

export default CompanyFilter;
