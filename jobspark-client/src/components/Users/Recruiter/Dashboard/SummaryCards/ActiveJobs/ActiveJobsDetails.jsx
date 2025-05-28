import React from 'react'
import { useLoaderData } from 'react-router'

const ActiveJobsDetails = () => {


    const data = useLoaderData();
    console.log("data", data);


    return (
        <div>ActiveJobsDetails</div>
    )
}

export default ActiveJobsDetails