import { BarChart } from '@mui/x-charts'
import React from 'react'

const ActiveJobs_FullTime = () => {



    // const categories = [
    //     "Most Popular",
    //     "No Applicants",
    //     "Recently Published",
    //     "Closing Soon"
    // ];

    // // Assuming you have the arrays or counts for each
    // const mostPopularCount = mostPopularJobs.length;
    // const noApplicantsCount = jobsWithNoApplicants.length;
    // const recentlyPublishedCount = recentJobs.data?.length || 0;
    // const closingSoonCount = closingVal.data?.closingInfo?.length || 0;

    // const counts = [
    //     mostPopularCount,
    //     noApplicantsCount,
    //     recentlyPublishedCount,
    //     closingSoonCount
    // ];




    return (



        <>
            <div className="w-full flex items-center overflow-x-auto py-5">
                <div className=" bg-white rounded-4xl shadow-lg p-6">
                    <BarChart
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: ['Page 1', 'Page 2', 'Page 3'],
                                categoryGapRatio: 0.4,
                                barGapRatio: 0.2,
                                label: 'Pages',
                            },
                        ]}
                        yAxis={[
                            {
                                label: 'Job Count',
                            },
                        ]}
                        series={[
                            {
                                data: [4, 3, 5],
                                label: 'Full-Time',
                                color: '#6366f1', // Indigo-500
                            },
                            {
                                data: [1, 6, 3],
                                label: 'Part-Time',
                                color: '#10b981', // Emerald-500
                            },
                        ]}
                        height={320}
                        width={500}
                        legend={{
                            direction: 'row',
                            position: {
                                vertical: 'top',
                                horizontal: 'middle',
                            },
                        }}
                        margin={{ top: 40, bottom: 50, right: 20 }}
                        grid={{ horizontal: true }}
                    />
                </div>

            </div>
        </>
    )
}

export default ActiveJobs_FullTime