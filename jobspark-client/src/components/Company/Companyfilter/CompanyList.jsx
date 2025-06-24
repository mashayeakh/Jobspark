import { BsThreeDotsVertical } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiBriefcase4Line } from "react-icons/ri";
import { MdOutlinePeople } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import Google from '../../../assets/imgs/companyLogo/google.png';
import { useContext, useEffect, useState } from "react";
import { CompanyContext } from "../../Context/CompanyContextProvider";

const CompaniesList = () => {
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

    return (
        <div className="pt-5 flex">
            <div className="grid grid-cols-4 gap-5">
                {data.map((company) => (
                    <div
                        key={company._id}
                        className="card bg-white border border-gray-200 rounded-md shadow-sm w-full relative group overflow-hidden"
                    >
                        <div className="card-body">
                            <div className="flex items-start gap-2">
                                <img src={Google} alt="" className="w-8 rounded-2xl" />

                                <div className="flex flex-col w-full">
                                    {/* Title and Dots */}
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="text-lg font-bold">
                                            {company.companyName}
                                        </h2>
                                        <button
                                            type="button"
                                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                            aria-label="More options"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="text-[#495057]">
                                <div className="flex items-center gap-1 mb-3">
                                    <HiOutlineLocationMarker size={23} />
                                    <p>{company.headquarters || "Unknown"}</p>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    <RiBriefcase4Line size={23} />
                                    <p>{company.industry || "N/A"}</p>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    <MdOutlinePeople size={23} />
                                    <p>{company.companySize || "N/A"} Employees</p>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                    <FaCode size={23} />
                                    <p>Java, Python</p>
                                </div>
                            </div>

                            <p className="text-[#495057]">
                                {company.description?.slice(0, 100) || "No description"}{" "}
                            </p>
                        </div>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out group-hover:scale-105 scale-100">
                            <a
                                href={`/company/${company._id}`}
                                className="text-primary text-lg font-bold underline"
                            >
                                See more
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompaniesList;
