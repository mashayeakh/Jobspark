import React from 'react'
import DashboardSidebar from './DashboardSidebar'
import SummaryCards from './SummaryCards/SummaryCards'
import { Outlet } from 'react-router'

const Dashboard = () => {
    return (
        // <div className="w-full md:w-11/12 h-full flex flex-1 overflow-hidden">
        <div className="w-full h-full flex flex-1 overflow-hidden">
            <DashboardSidebar />
            {/* <main className="flex-1 overflow-y-auto "> */}
            <main className="flex-1 overflow-y-auto">
                {/* <div className='p-4'> */}
                <div className=''>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Dashboard