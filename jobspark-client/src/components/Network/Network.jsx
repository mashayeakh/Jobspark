import React from 'react'
import NetworkSideBar from './NetworkSideBar';
import NetworkLayout from './NetworkLayout';

const Network = () => {
    return (
        <div className="flex flex-col md:flex-row px-4 md:px-8 py-6 gap-6">
            <NetworkSideBar />
            <div className="flex-1">
                <NetworkLayout />
            </div>
        </div>
    )
}

export default Network