import React from 'react'
import { Outlet } from 'react-router'

const SummaryCards = () => {
    return (
        <div className='w-full'>
            <Outlet />
        </div>
    )
}

export default SummaryCards