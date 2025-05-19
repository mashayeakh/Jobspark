import React from 'react'
import Google from '../../../assets/imgs/companyLogo/google.png';

const HomeCategory = () => {
    return (

        <div className='bg-[#f8fafb] py-10'>
            <div className='text-center  pb-12 '>
                <p className='pb-3 text-3xl'>Job Category</p>
                <div className='md:w-40 lg:w-[55%] mx-auto'>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam doloribus modi maxime et quos eveniet atque officia ullam explicabo praesentium fugit ea esse ipsam, voluptatibus ad, expedita sunt repudiandae sapiente.
                </div>
            </div>
            <div className='flex justify-center 0'>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    <div className="card inset-shadow-sm inset-shadow-indigo-500/50 cursor-pointer text-primary-content w-96 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                        <div className="card-body text-center text-black flex items-center">
                            <figure>
                                <img src={Google} alt="" className="w-23" />
                            </figure>
                            <p>Software Development</p>
                        </div>
                    </div>
                    <div className="card inset-shadow-sm inset-shadow-indigo-500/50 cursor-pointer text-primary-content w-96 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                        <div className="card-body text-center text-black flex items-center">
                            <figure>
                                <img src={Google} alt="" className="w-23" />
                            </figure>
                            <p>Software Development</p>
                        </div>
                    </div>
                    <div className="card inset-shadow-sm inset-shadow-indigo-500/50 cursor-pointer text-primary-content w-96 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                        <div className="card-body text-center text-black flex items-center">
                            <figure>
                                <img src={Google} alt="" className="w-23" />
                            </figure>
                            <p>Software Development</p>
                        </div>
                    </div>
                    <div className="card inset-shadow-sm inset-shadow-indigo-500/50 cursor-pointer text-primary-content w-96 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                        <div className="card-body text-center text-black flex items-center">
                            <figure>
                                <img src={Google} alt="" className="w-23" />
                            </figure>
                            <p>Software Development</p>
                        </div>
                    </div>
                    <div className="card inset-shadow-sm inset-shadow-indigo-500/50 cursor-pointer text-primary-content w-96 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                        <div className="card-body text-center text-black flex items-center">
                            <figure>
                                <img src={Google} alt="" className="w-23" />
                            </figure>
                            <p>Software Development</p>
                        </div>
                    </div>
                    <div className="card inset-shadow-sm inset-shadow-indigo-500/50 cursor-pointer text-primary-content w-96 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                        <div className="card-body text-center text-black flex items-center">
                            <figure>
                                <img src={Google} alt="" className="w-23" />
                            </figure>
                            <p>Software Development</p>
                        </div>
                    </div>
                    <div className="card inset-shadow-sm inset-shadow-indigo-500/50 cursor-pointer text-primary-content w-96 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
                        <div className="card-body text-center text-black flex items-center">
                            <figure>
                                <img src={Google} alt="" className="w-23" />
                            </figure>
                            <p>Software Development</p>
                        </div>
                    </div>




                </div>

            </div>
        </div>
    )
}

export default HomeCategory