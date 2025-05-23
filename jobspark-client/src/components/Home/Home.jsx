import React, { useEffect, useState } from 'react'

import heroImg from "../../assets/imgs/HomeImg/heroimg.jpeg"
// import HomeForm from './HomeForm';
import HomeJobs from './HomeJobs/HomeJobs';
import ConnectesCompany from './ConnectedCompany/ConnectesCompany';
// import { Marquee } from 'marquee';
import HomeForm from './HomeForm/HomeForm';
import HomeCategory from './HomeCategory/HomeCategory';
import HomeSubscribe from './HomeSubscribe/HomeSubscribe';
// App.jsx or index.jsx
import '../../../src/index.css';

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


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const trendingJobs = ["Software Development", "Web Development", "Graphis Design", "Frontend Developer", "Backend Developer"]

    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [charIndex, setCharIndex] = useState(0);

    useEffect(() => {
        if (charIndex < trendingJobs[currentIndex].length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + trendingJobs[currentIndex][charIndex]);
                setCharIndex((prev) => prev + 1);
            }, 50); // typing speed
            return () => clearTimeout(timeout);
        } else {
            const pauseBeforeNext = setTimeout(() => {
                setCharIndex(0);
                setDisplayText("");
                setCurrentIndex((prev) => (prev + 1) % trendingJobs.length);
            }, 1500); // pause after full text
            return () => clearTimeout(pauseBeforeNext);
        }
    }, [charIndex, currentIndex, trendingJobs]);




    return (
        <>
            <div
                className="hero min-h-screen"
                style={{
                    // backgroundImage: `url(${heroImg})`,
                    backgroundImage: `url(${heroImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    position: 'relative'
                }}
            >
                <div className="hero-overlay"></div>
                <div className="text-neutral-content">
                    <div>

                        <div className='text-6xl md:w-40 lg:w-[55%] text-start text-shadow-white '>
                            <p className='mb-5 '>Find your next big opportunity — <span>faster
                            </span> </p>
                        </div>
                        <div className='text-start lg:mt-3 pb-5'>
                            <p className='text-shadow-white text-2xl'>
                                Trending Job: <span className="font-semibold">{displayText}</span>
                            </p>
                        </div>
                    </div>
                    <HomeForm />
                </div>
            </div >
            {/* <HomeForm /> */}
            <ConnectesCompany />
            <HomeJobs />
            <div className='py-15 flex justify-center'>
                <button className='btn btn-success text-black text-xl p-5'>Browse For More Jobs</button>
            </div>
            <HomeCategory />
            <div className='py-15 flex justify-center'>
                <button className='btn btn-success text-black text-xl p-5'>Browse For More Category</button>
            </div>
            <HomeSubscribe />
        </>
    )
}

export default Home