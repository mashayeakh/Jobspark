import React from 'react'
import { IoLocation, IoSearchOutline } from "react-icons/io5";


const HomeForm = () => {
    return (
        <>
            <div>
                <form action="">
                    <fieldset className="fieldset w-fit p-2">
                        <div className="join">
                            <input
                                type="text"
                                className="input join-item lg:input-xl text-black placeholder-black w-fit"
                                placeholder="Search for keywords"
                            />



                            <select defaultValue="Select location" className="select input join-item w-fit lg:input-xl text-black">

                                <option disabled={true}>Select location
                                </option>
                                <option>Crimson</option>
                                <option>Amber</option>
                                <option>Velvet</option>
                            </select>


                            <select defaultValue="Category" className="select input join-item w-fit lg:input-xl text-black">

                                <option disabled={true}>Category
                                </option>
                                <option>Crimson</option>
                                <option>Amber</option>
                                <option>Velvet</option>
                            </select>
                            <button className="btn join-item lg:btn-xl">
                                <IoSearchOutline />

                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </>
    )
}

export default HomeForm