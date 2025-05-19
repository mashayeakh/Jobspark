import React from 'react'

const HomeSubscribe = () => {
    return (
        <div className='py-12 bg-gray-600 text-white'>
            <div className='text-center max-w-xl mx-auto px-4'>
                <h2 className="text-3xl font-bold mb-4">Stay Updated with the Latest Jobs</h2>
                <p className="mb-4">Subscribe to receive job alerts, career tips, and updates directly to your inbox.</p>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full max-w-md text-black"
                />
            </div>
        </div>
    )
}

export default HomeSubscribe;
