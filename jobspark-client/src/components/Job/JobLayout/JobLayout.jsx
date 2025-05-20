import React from 'react'

const JobLayout = () => {
    return (
        <>
            <div className="w-full flex flex-col">

                <div className="px-3 pb-2">
                    <p className="text-xl font-bold">Showing Result: 2788</p>
                    <span className='text-gray-400'>UI Designer | Dhaka, BD</span>
                </div>


                <div className="flex justify-center w-fit">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* CARD 1 */}
                        <div className="card w-96 bg-base-100 shadow-sm">
                            <figure>
                                <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">Card Title</h2>
                                <p>Some quick card description here.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Buy Now</button>
                                </div>
                            </div>
                        </div>
                        <div className="card w-96 bg-base-100 shadow-sm">
                            <figure>
                                <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">Card Title</h2>
                                <p>Some quick card description here.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Buy Now</button>
                                </div>
                            </div>
                        </div>
                        <div className="card w-96 bg-base-100 shadow-sm">
                            <figure>
                                <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">Card Title</h2>
                                <p>Some quick card description here.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Buy Now</button>
                                </div>
                            </div>
                        </div>
                        <div className="card w-96 bg-base-100 shadow-sm">
                            <figure>
                                <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">Card Title</h2>
                                <p>Some quick card description here.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Buy Now</button>
                                </div>
                            </div>
                        </div>
                        <div className="card w-96 bg-base-100 shadow-sm">
                            <figure>
                                <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">Card Title</h2>
                                <p>Some quick card description here.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Buy Now</button>
                                </div>
                            </div>
                        </div>

                        {/* CARD 2 */}
                        <div className="card w-96 bg-base-100 shadow-sm">
                            <figure>
                                <img src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="Shoes" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">Card Title</h2>
                                <p>Another card description here.</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">Buy Now</button>
                                </div>
                            </div>
                        </div>

                        {/* Add more cards... */}
                    </div>
                </div>
            </div>


        </>
    )
}

export default JobLayout 