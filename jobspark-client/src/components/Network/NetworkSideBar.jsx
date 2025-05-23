import React from 'react'
import { IoIosArrowDown } from 'react-icons/io'

const NetworkSideBar = () => {
    return (
        <>
            <div className="">

                <div className='p-6 text-center border'>
                    <p className='text-3xl pb-2'>Manage my network</p>
                    <div className='w-full rounded-xl bg-white'>
                        <div className="mb-3 shadow-sm p-7">
                            <p className="text-xl pb-2 text-start"> Total Connections👥 <strong>{32}</strong></p>
                            <p className="text-xl pb-2 text-start"> Pending Requests ⏳ <strong>{23}</strong></p>
                            <p className="text-xl pb-2 text-start"> Companies Followed 🏢 <strong>{34}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NetworkSideBar