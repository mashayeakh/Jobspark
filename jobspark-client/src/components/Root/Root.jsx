import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router'
import freeP from "../../assets/imgs/freePalestian.jpg"

const Root = () => {
    return (
        <>
            <div>
                <img
                    src={freeP}
                    alt=""
                    style={{ width: "100vw", height: "80px", display: "block" }}
                />
            </div>
            <div className=''>
                <Navbar />
                <Outlet />
            </div>
        </>
    )
}

export default Root