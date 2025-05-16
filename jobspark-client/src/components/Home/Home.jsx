import React, { useEffect, useState } from 'react'

import heroImg from "../../assets/imgs/HomeImg/heroimg.jpeg"

const Home = () => {


    const [bgPosition, setBgPosition] = useState("80px");

    useEffect(() => {
        //get the window width
        const handleBgPosition = () => {
            const width = window.innerWidth;
            if (width < 640)
                setBgPosition("56px");
            else if (width < 1024) setBgPosition("72px");
            else setBgPosition("96px");
            console.log("Window width:", width); // 👈 Add this

        }
        handleBgPosition();
        //whenever user changes the screen size it calls handleBgPosition
        window.addEventListener("resize", handleBgPosition);
        return () => {
            //clean up to avoid memory leaks
            window.removeEventListener("resize", handleBgPosition);
        }
    }, [])



    return (
        <>
            <div
                className="hero min-h-screen"
                style={{
                    backgroundImage: `url(${heroImg})`,
                }}
            >
                <div className="hero-overlay"></div>
                <div className="hero-content text-neutral-content text-center">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
                        <p className="mb-5">
                            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                            quasi. In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Home