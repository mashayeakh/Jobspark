import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import heroImg from "../../assets/imgs/HomeImg/heroimg.jpeg"
import HomeJobs from './HomeJobs/HomeJobs'
import ConnectesCompany from './ConnectedCompany/ConnectesCompany'
import HomeForm from './HomeForm/HomeForm'
import HomeCategory from './HomeCategory/HomeCategory'
import HomeSubscribe from './HomeSubscribe/HomeSubscribe'
import '../../../src/index.css'
import ShowProfileModal from './Modal/ShowProfileModal'
import { useNavigate } from 'react-router'
import { FiArrowRight } from 'react-icons/fi'

const Home = () => {
    const [bgPosition, setBgPosition] = useState("80px")
    const trendingJobs = ["Software Development", "Web Development", "Graphic Design", "Frontend Developer", "Backend Developer"]
    const [currentIndex, setCurrentIndex] = useState(0)
    const [displayText, setDisplayText] = useState("")
    const [charIndex, setCharIndex] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const handleBgPosition = () => {
            const width = window.innerWidth
            if (width < 640) setBgPosition("56px")
            else if (width < 1024) setBgPosition("72px")
            else setBgPosition("96px")
        }
        handleBgPosition()
        window.addEventListener("resize", handleBgPosition)
        return () => window.removeEventListener("resize", handleBgPosition)
    }, [])

    useEffect(() => {
        if (charIndex < trendingJobs[currentIndex].length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + trendingJobs[currentIndex][charIndex])
                setCharIndex(prev => prev + 1)
            }, 50)
            return () => clearTimeout(timeout)
        } else {
            const pauseBeforeNext = setTimeout(() => {
                setCharIndex(0)
                setDisplayText("")
                setCurrentIndex(prev => (prev + 1) % trendingJobs.length)
            }, 1500)
            return () => clearTimeout(pauseBeforeNext)
        }
    }, [charIndex, currentIndex])

    const handleBtn = () => navigate("/jobs")

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    }

    const heroTextVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    }

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <motion.div
                className="hero min-h-screen relative overflow-hidden"
                style={{
                    backgroundImage: `url(${heroImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    className="hero-overlay bg-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                <motion.div
                    className="hero-content text-neutral-content text-center lg:text-left px-4 lg:px-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="max-w-4xl">
                        <motion.h1
                            className="mb-5 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-start"
                            variants={heroTextVariants}
                        >
                            Find your next big opportunity —{" "}
                            <motion.span
                                className="text-primary"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                faster
                            </motion.span>
                        </motion.h1>

                        <motion.div
                            className="text-start lg:mt-3 pb-5"
                            variants={itemVariants}
                        >
                            <p className="text-xl md:text-2xl">
                                Trending Job:{" "}
                                <motion.span
                                    className="font-semibold text-primary"
                                    key={currentIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {displayText}
                                    <motion.span
                                        className="inline-block w-1 h-8 bg-primary ml-1"
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                    />
                                </motion.span>
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <HomeForm />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Connected Companies */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <ConnectesCompany />
            </motion.section>

            {/* Featured Jobs */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="py-12"
            >
                <HomeJobs />
            </motion.section>

            {/* Browse More Button */}
            <motion.div
                className="py-15 flex justify-center my-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <motion.button
                    onClick={handleBtn}
                    className="btn btn-primary text-white text-lg md:text-xl px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Browse For More Jobs
                    <FiArrowRight className="ml-2" />
                </motion.button>
            </motion.div>

            {/* Job Categories */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <HomeCategory />
            </motion.section>

            {/* Newsletter Subscription */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="my-12"
            >
                <HomeSubscribe />
            </motion.section>

            <ShowProfileModal />
        </div>
    )
}

export default Home