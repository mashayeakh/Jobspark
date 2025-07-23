import React from 'react'
import { Outlet } from 'react-router'
import DashboardSidebar from '../../Recruiter/Dashboard/DashboardSidebar'
import Admin_DashboardSidebar from './Admin_DashboardSidebar'

const Admin_Dashboard = () => {
    return (
        <div className="w-full h-full flex flex-1 overflow-hidden">
            <Admin_DashboardSidebar />
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

export default Admin_Dashboard