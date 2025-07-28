import React, { useContext } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { JobSeekerDashboardContext } from '../../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';
import { COLORS } from './../../../../../../../../constants/Colors';
import CustomTooltip from '../../../../../../../../constants/CustomTooltip';

const CompletenessChart = () => {
    const { completeness } = useContext(JobSeekerDashboardContext);

    const completeProfiles = completeness?.completeProfiles;
    const total = completeness?.totalJobSeekers || 0;
    const incompleteProfiles = total - completeProfiles;

    const profileCompletenessChartData = [
        { name: 'Complete (>=90%)', value: completeProfiles },
        { name: 'Incomplete (<90%)', value: incompleteProfiles },
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const pieVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.8,
                type: 'spring'
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
        >
            <motion.div
                variants={itemVariants}
                className="flex justify-between items-center mb-4"
            >
                <h3 className="text-lg font-semibold text-gray-900">Profile Completeness</h3>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-md"
                    >
                        Weekly
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded-md"
                    >
                        Monthly
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs px-2 py-1 bg-gray-100 rounded-md"
                    >
                        Yearly
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                variants={pieVariants}
                className="w-full h-[300px]"
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={profileCompletenessChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                        >
                            {profileCompletenessChartData?.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            content={<CustomTooltip />}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </motion.div>
        </motion.div>
    );
};

export default CompletenessChart;