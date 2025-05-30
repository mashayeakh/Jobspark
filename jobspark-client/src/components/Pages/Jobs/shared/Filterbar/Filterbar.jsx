import React from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import saveIcon from "../../../../../assets/imgs/icons/save-instagram.png"
const Filterbar = () => {
    return (

        <>
            <div>

            </div>
            <div className="">
                <div className='flex justify-between px-3 pb-2'>
                    <p className='text-lg'>Details</p>
                    <button className='cursor-pointer text-blue-700 font-bold text-lg'>Clear All</button>
                </div>
                <div className='w-full p-6 border rounded-xl bg-white'>

                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xl font-bold">Experience Label</p>
                        <IoIosArrowDown size={20} />
                    </div>
                    <div className='py-3 '>
                        <div className='flex pb-3 gap-5'>

                            {/* <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Any </p> */}

                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Entry Level </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Intermediate </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Senior </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Expert </p>
                        </div>
                    </div>
                    <div className='divider'></div>
                    <div className='flex items-center justify-between gap-10'>
                        <p className='text-xl font-bold'>Job Type
                        </p>
                        <IoIosArrowDown size={20} />
                    </div>

                    <div className='py-3 '>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Any </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Entry Level </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Intermediate </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Senior </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Expert </p>
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-10'>
                        <p className='text-xl font-bold'>Job Functions
                        </p>
                        <IoIosArrowDown size={20} />
                    </div>
                    <div className='py-3 '>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Any </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Entry Level </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Intermediate </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Senior </p>
                        </div>
                        <div className='flex pb-3 gap-5'>

                            <input
                                type="checkbox"
                                checked="checked"
                                className="checkbox border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                            />
                            <p>Expert </p>
                        </div>
                    </div>
                    <div className='divider'></div>

                    <div className='flex justify-between'>

                        <div className='flex items-center justify-between gap-10'>
                            <p className='text-xl font-bold'>Saved Jobs
                            </p>

                        </div>
                        <button className='py-1 '>
                            <img src={saveIcon} alt="" className='w-5 cursor-pointer' />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filterbar    