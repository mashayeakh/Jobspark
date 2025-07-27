import { Grid, Paper, Typography, useTheme } from '@mui/material';
import React from 'react';
import { motion } from 'framer-motion';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

const pieHoverVariants = {
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.3
        }
    }
};

const barHoverVariants = {
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.3
        }
    }
};

const JobSeeker_Charts = () => {
    const theme = useTheme();

    const pieData = [
        { name: 'React', value: 30 },
        { name: 'Node.js', value: 20 },
        { name: 'Python', value: 15 },
        { name: 'JavaScript', value: 25 },
        { name: 'CSS', value: 10 }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347'];

    const jobSeekerActivityData = [
        { month: 'Jan', applications: 50, profileUpdates: 10 },
        { month: 'Feb', applications: 60, profileUpdates: 20 },
        { month: 'Mar', applications: 40, profileUpdates: 30 },
        { month: 'Apr', applications: 70, profileUpdates: 40 },
        { month: 'May', applications: 80, profileUpdates: 50 },
    ];

    return (
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            {/* Pie Chart: Skills Breakdown */}
            <Grid item xs={12} md={6}>
                <motion.div
                    variants={chartVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={pieHoverVariants}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: '12px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Skills Breakdown of Active Jobs
                        </Typography>
                        <ResponsiveContainer width="100%" minWidth={400} height={350}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    innerRadius={60}
                                    paddingAngle={2}
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(0)}%)`
                                    }
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke={theme.palette.background.paper}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{
                                        paddingLeft: 20
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </motion.div>
            </Grid>

            {/* Bar Chart: Job Seeker Activity by Month */}
            <Grid item xs={12} md={6}>
                <motion.div
                    variants={chartVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    variants={barHoverVariants}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 3,
                            borderRadius: '12px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Job Seeker Activity by Month
                        </Typography>
                        <ResponsiveContainer width="100%" minWidth={320} height={350}>
                            <BarChart
                                data={jobSeekerActivityData}
                                barGap={6}
                                barCategoryGap="20%"
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="applications"
                                    fill="#0088FE"
                                    maxBarSize={40}
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                />
                                <Bar
                                    dataKey="profileUpdates"
                                    fill="#00C49F"
                                    maxBarSize={40}
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </motion.div>
            </Grid>
        </Grid>
    )
}

export default JobSeeker_Charts;