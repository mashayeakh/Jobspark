import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import {
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import { JobSeekerDashboardContext } from '../../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';
import useJobSeekerProfiles from '../../../../../../../Hooks/userJobSeekerProfile';
import { COLORS } from '../../../../../../../../constants/Colors';
import CustomTooltip from '../../../../../../../../constants/CustomTooltip';

const ExperienceLevelsChart = () => {
    const { profiles } = useJobSeekerProfiles();
    const theme = useTheme();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
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
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    // Process experience level data
    const experienceLevelCounts = profiles?.reduce((acc, profile) => {
        const level = profile.experienceLevel || 'Not Specified';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
    }, {});

    const experienceChartData = Object.entries(experienceLevelCounts || {})
        ?.map(([name, value]) => ({
            name: name.split(' ')[0],
            value,
            fullName: name
        }))
        ?.sort((a, b) => b.value - a.value);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Paper
                component={motion.div}
                variants={itemVariants}
                elevation={3}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                        boxShadow: theme.shadows[6]
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                <Typography
                    variant="h6"
                    component={motion.div}
                    variants={itemVariants}
                    sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: theme.palette.text.primary
                    }}
                >
                    Experience Levels
                </Typography>

                <motion.div
                    variants={pieVariants}
                    style={{ height: 300 }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={experienceChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                innerRadius={60}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                                animationBegin={200}
                                animationDuration={1000}
                                animationEasing="ease-out"
                            >
                                {experienceChartData?.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={<CustomTooltip />}
                                formatter={(value, name, props) => [
                                    value,
                                    props.payload.fullName || name
                                ]}
                            />
                            <Legend
                                formatter={(value, entry, index) => (
                                    <span style={{ color: theme.palette.text.secondary }}>
                                        {experienceChartData[index]?.fullName || value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>
            </Paper>
        </motion.div>
    );
};

export default ExperienceLevelsChart;