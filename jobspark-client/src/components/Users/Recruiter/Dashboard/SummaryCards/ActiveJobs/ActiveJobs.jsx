import React from 'react'

const ActiveJobs = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full mt-5 h-full">
            {[...Array(5)].map((_, idx) => (
                <div key={idx} className="flex justify-center items-center h-full">
                    <div className="card bg-primary text-primary-content w-48 h-48 md:w-fit md:h-fit rounded-full shadow-xl flex items-center justify-center">
                        <div className="card-body flex flex-col items-center justify-center text-center">
                            <p className="flex items-center justify-center h-full w-full">
                                Most Populer job
                            </p>
                            <span>
                                UX/UI Designer"
                                25 Applicants • Deadline in 4 days
                            </span>

                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ActiveJobs