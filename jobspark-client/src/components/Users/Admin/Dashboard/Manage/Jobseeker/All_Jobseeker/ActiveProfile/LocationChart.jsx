import React, { useContext } from 'react';
import { JobSeekerDashboardContext } from '../../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import CustomTooltip from '../../../../../../../../constants/CustomTooltip';
import useJobSeekerProfiles from '../../../../../../../Hooks/userJobSeekerProfile';
import { motion } from 'framer-motion';

// Motion variants
const fadeIn = (direction, type, delay, duration) => ({
    hidden: {
        x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
        y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
        opacity: 0,
    },
    show: {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
            type,
            delay,
            duration,
            ease: 'easeOut',
        },
    },
});

const textVariant = (delay) => ({
    hidden: {
        y: 20,
        opacity: 0,
    },
    show: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            delay,
        },
    },
});

const staggerContainer = (staggerChildren, delayChildren) => ({
    hidden: {},
    show: {
        transition: {
            staggerChildren,
            delayChildren,
        },
    },
});

const barAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1]
        }
    })
};

const LocationChart = () => {
    const { stats, active_profile, completeness } = useContext(JobSeekerDashboardContext);
    const { profiles } = useJobSeekerProfiles();

    const locationCounts = profiles?.reduce((acc, profile) => {
        const loc = profile?.location?.trim();
        if (loc) {
            acc[loc] = (acc[loc] || 0) + 1;
        }
        return acc;
    }, {});

    const locationChartData = Object.entries(locationCounts || [])?.map(([name, count]) => ({ name, count }))?.sort((a, b) => b.count - a.count);

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.1, 0.1)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
            <motion.h3
                className="text-lg font-semibold text-gray-900 mb-4"
                variants={textVariant(0.1)}
            >
                Location Distribution
            </motion.h3>

            <motion.div
                variants={fadeIn('up', 'spring', 0.2, 0.75)}
                whileHover={{ scale: 1.01 }}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={locationChartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 12 }}
                            width={100}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar
                            dataKey="count"
                            fill="#10B981"
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                            animationDuration={1500}
                            animationEasing="ease-in-out"
                        >
                            {locationChartData?.map((entry, index) => (
                                <motion.g
                                    key={`bar-${index}`}
                                    variants={barAnimation}
                                    custom={index}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Bar
                                        dataKey="count"
                                        fill={`hsl(${index * 30}, 70%, 50%)`}
                                    />
                                </motion.g>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    );
};

export default LocationChart;