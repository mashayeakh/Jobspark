import React from 'react'
import { useLoaderData, useLocation } from 'react-router'

const ApplicantsDetails = () => {

    const data = useLoaderData();

    console.log("Data ", data);



    return (
        <div>ApplicantsDetails</div>
    )
}

export default ApplicantsDetails