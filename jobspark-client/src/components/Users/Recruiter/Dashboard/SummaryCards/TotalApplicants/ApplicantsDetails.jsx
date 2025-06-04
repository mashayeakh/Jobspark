import React from 'react'
import { AiFillSchedule } from 'react-icons/ai';
import { useLoaderData, useLocation } from 'react-router'

const ApplicantsDetails = () => {

    const data = useLoaderData();

    console.log("Data =====", data);

    

    return (
        <>
            <div>
                <div>
                    Applicant name :
                    <strong>
                        {data.data?.userName || "N/A"}
                    </strong>
                </div>
            </div>

        </>
    )
}

export default ApplicantsDetails