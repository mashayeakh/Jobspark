import React, { useContext, useEffect, useState } from 'react'
import { AiFillSchedule } from 'react-icons/ai';
import { useLoaderData, useLocation, useParams } from 'react-router'
import { getMethod } from '../../../../../Utils/Api';
import { AuthContext } from './../../../../../Context/AuthContextProvider';

const ApplicantsDetails = () => {

    const data = useLoaderData();
    console.log("Data =====", data);

    const urlId = useParams();
    // console.log("Url id=== ", urlId);
    // console.log("Applicantq id=== ", urlId.applicantId);

    const [status, setStatus] = useState("");

    const handleRecruiterAction = (actionType) => {
        console.log("Action Type : ", actionType);
        if (status) return;

        const sendingData = {
            job: "",
            // applicant: urlId.applicantId,
            // recruiter: urlId.recruiterId,
            status: actionType,
            message: actionType === "shortlisted" ? "Candidate shows great potential" : "Candidate doesn't match"
        }


    }




    return (
        <>
            <div>
                <div>
                    Applicant name :
                    <strong>
                        {data.data?.userName || "N/A"}
                    </strong>
                    <div>
                        <div className="dropdown dropdown-start">
                            <div tabIndex={0} role="button" className="btn m-1">Action</div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <li>
                                    <button onClick={() => handleRecruiterAction('shortlisted')}>Shortlist</button>
                                </li>
                                <li>
                                    <button onClick={() => handleRecruiterAction('rejected')}>Reject</button>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default ApplicantsDetails