import React, { useContext } from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { TotalApplicationContext } from '../../../../Context/TotalApplicationProvider';
import { GraphsContext } from '../../../../Context/GraphsContextProvider';

// Motion utility functions
const textVariant = (delay) => {
    return {
        hidden: {
            y: -50,
            opacity: 0,
        },
        show: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                duration: 1.25,
                delay: delay,
            },
        },
    };
};

const fadeIn = (direction, type, delay, duration) => {
    return {
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
                type: type,
                delay: delay,
                duration: duration,
                ease: 'easeOut',
            },
        },
    };
};

const staggerContainer = (staggerChildren, delayChildren) => {
    return {
        hidden: {},
        show: {
            transition: {
                staggerChildren: staggerChildren,
                delayChildren: delayChildren || 0,
            },
        },
    };
};

// Data arrays remain the same...
// Data
// const lineData = [
//     { date: 'Jul 12', total: 1 },
//     { date: 'Jul 13', total: 0 },
//     { date: 'Jul 14', total: 2 },
//     { date: 'Jul 15', total: 3 },
//     { date: 'Jul 16', total: 4 },
//     { date: 'Jul 17', total: 1 },
// ];

const barData = [
    { job: 'UI/UX Designer', applicants: 2 },
    { job: 'Frontend Dev', applicants: 3 },
    { job: 'AI Intern', applicants: 1 },
    { job: 'Graphic Designer', applicants: 2 },
];

const pieData = [
    { name: 'New', value: 3 },
    { name: 'Shortlisted', value: 5 },
    { name: 'Rejected', value: 0 },
];

const areaData = [
    { date: 'Jul 12', new: 1, shortlisted: 0 },
    { date: 'Jul 13', new: 0, shortlisted: 1 },
    { date: 'Jul 14', new: 2, shortlisted: 1 },
    { date: 'Jul 15', new: 3, shortlisted: 2 },
    { date: 'Jul 16', new: 1, shortlisted: 1 },
    { date: 'Jul 17', new: 2, shortlisted: 0 },
];

const categoryData = [
    { category: ' Dev', count: 5 },
    { category: 'UI/UX', count: 3 },
    { category: 'AI/ML', count: 2 },
    { category: 'Marketing', count: 1 },
];

const hourData = [
    { hour: '00', apps: 1 }, { hour: '01', apps: 0 }, { hour: '02', apps: 0 },
    { hour: '03', apps: 0 }, { hour: '04', apps: 0 }, { hour: '05', apps: 1 },
    { hour: '06', apps: 0 }, { hour: '07', apps: 2 }, { hour: '08', apps: 3 },
    { hour: '09', apps: 4 }, { hour: '10', apps: 3 }, { hour: '11', apps: 1 },
    { hour: '12', apps: 2 }, { hour: '13', apps: 0 }, { hour: '14', apps: 0 },
];

const COLORS = ['#42a5f5', '#66bb6a', '#ef5350'];

const chartVariants = {
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


const ApplicationGraphDashboard = () => {
    const theme = useTheme();


    const { getAllApplicants, applied, activity } = useContext(TotalApplicationContext);



    const { lineData } = useContext(GraphsContext);

    console.log("LineData ", lineData);


    return (
        <Box
            component={motion.div}
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.1, 0.2)}
            sx={{
                width: '100%',
                minHeight: '100vh',
                padding: { xs: 2, sm: 4 },
                background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
            }}
        >
            {/* Header Section */}
            <Box
                component={motion.div}
                variants={textVariant(0.2)}
                sx={{
                    mb: 2,
                    textAlign: 'center',
                    maxWidth: '1200px',
                    mx: 'auto',
                    px: 2
                }}
            >
                <Typography
                    variant="h3"
                    fontWeight={700}
                    color="primary.main"
                    gutterBottom
                    sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                >
                    Application Analytics Dashboard
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                >
                    Comprehensive overview of your recruitment pipeline
                </Typography>
            </Box>

            {/* Main Content Container */}

            {/* Summary Cards */}
            <Grid
                container
                spacing={4}
                mb={4}
                component={motion.div}
                variants={staggerContainer(0.1, 0.2)}
                sx={{
                    justifyContent: 'center'
                }}
            >
                {[
                    { title: 'Total Applications', value: `${applied?.count || 0}`, change: '+2.5%', color: 'primary' },
                    { title: 'Shortlisted', value: `${activity?.shortlistedCount || 0}`, change: '+1.2%', color: 'secondary' },
                    { title: 'Rejected', value: `${activity?.rejectedCount || 0}`, change: '0%', color: 'error' },
                    { title: 'Avg. Response Time', value: '2.3 days', change: '-0.5 days', color: 'info' }
                ].map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            component={motion.div}
                            variants={fadeIn('up', 'spring', index * 0.2, 0.75)}
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                background: theme.palette[card.color].light,
                                color: theme.palette[card.color].contrastText,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '160px',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: 0,
                                    borderRadius: 3,
                                    padding: '2px',
                                    background: `linear-gradient(45deg, ${theme.palette[card.color].main}, ${theme.palette[card.color].light})`,
                                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                    WebkitMaskComposite: 'xor',
                                    maskComposite: 'exclude',
                                    pointerEvents: 'none',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease-in-out'
                                },
                                '&:hover::before': {
                                    opacity: 1
                                },
                                boxShadow: `0 0 8px ${theme.palette[card.color].main}`
                            }}
                            whileHover={{
                                scale: 1.03,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight={500}>
                                {card.title}
                            </Typography>
                            <Box>
                                <Typography variant="h4" fontWeight={700} mt={1}>
                                    {card.value}
                                </Typography>
                                <Typography variant="caption" display="block" mt={1}>
                                    {card.change} from last week
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>


            <Box
                sx={{
                    maxWidth: '2200px',
                    mx: 'auto',
                    px: { xs: 0, sm: 2 }
                }}
            >
                {/* Charts Grid */}
                <Grid
                    container
                    spacing={4}
                    component={motion.div}
                    variants={staggerContainer(0.1, 0.2)}
                    sx={{
                        justifyContent: "center"
                    }}
                >
                    {/* Applications Over Time */}
                    <Grid item xs={12} lg={6} xl={4}>
                        <Paper
                            component={motion.div}
                            variants={fadeIn('up', 'spring', 0.2, 0.75)}
                            elevation={0}
                            sx={{
                                padding: 3,
                                height: 400,
                                borderRadius: 4,
                                background: 'white',
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    boxShadow: theme.shadows[8]
                                },
                                transition: 'box-shadow 0.3s ease'
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} mb={2} color="primary">
                                📈 Applications Over Time
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <LineChart data={lineData?.data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: theme.shadows[3],
                                            background: 'rgba(255, 255, 255, 0.96)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke={theme.palette.primary.main}
                                        strokeWidth={3}
                                        dot={{ r: 5, fill: theme.palette.primary.main }}
                                        activeDot={{ r: 8, stroke: theme.palette.primary.dark }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Applications By Job */}
                    <Grid item xs={12} lg={6} xl={4}>
                        <Paper
                            component={motion.div}
                            variants={fadeIn('up', 'spring', 0.4, 0.75)}
                            elevation={0}
                            sx={{
                                padding: 3,
                                height: 400,
                                borderRadius: 4,
                                background: 'white',
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    boxShadow: theme.shadows[8]
                                },
                                transition: 'box-shadow 0.3s ease'
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} mb={2} color="primary">
                                📊 Applications Per Job
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="job" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: theme.shadows[3],
                                            background: 'rgba(255, 255, 255, 0.96)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="applicants"
                                        fill={theme.palette.secondary.main}
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Application Status Breakdown */}
                    <Grid item xs={12} lg={6} xl={4}>
                        <Paper
                            component={motion.div}
                            variants={fadeIn('up', 'spring', 0.6, 0.75)}
                            elevation={0}
                            sx={{
                                padding: 3,
                                height: 400,
                                borderRadius: 4,
                                background: 'white',
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    boxShadow: theme.shadows[8]
                                },
                                transition: 'box-shadow 0.3s ease'
                            }}
                        >
                            <Typography variant="h4" fontWeight={600} mb={2} color="primary">
                                🧭 Status Breakdown
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        innerRadius={60}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                        animationBegin={200}
                                        animationDuration={1000}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: theme.shadows[3],
                                            background: 'rgba(255, 255, 255, 0.96)'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: '20px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Daily Activity */}
                    <Grid item xs={12} lg={6} xl={4}>
                        <Paper
                            component={motion.div}
                            variants={fadeIn('up', 'spring', 0.8, 0.75)}
                            elevation={0}
                            sx={{
                                padding: 3,
                                height: 400,
                                borderRadius: 4,
                                background: 'white',
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    boxShadow: theme.shadows[8]
                                },
                                transition: 'box-shadow 0.3s ease'
                            }}
                        >
                            <Typography variant="h4" fontWeight={600} mb={2} color="primary">
                                📊 Daily Activity
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={areaData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: theme.shadows[3],
                                            background: 'rgba(255, 255, 255, 0.96)'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="new"
                                        stackId="1"
                                        stroke="#42a5f5"
                                        fill="#bbdefb"
                                        fillOpacity={0.8}
                                        animationDuration={1500}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="shortlisted"
                                        stackId="1"
                                        stroke="#66bb6a"
                                        fill="#c8e6c9"
                                        fillOpacity={0.8}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Category-wise Applications */}
                    <Grid item xs={12} lg={6} xl={4}>
                        <Paper
                            component={motion.div}
                            variants={fadeIn('up', 'spring', 1.0, 0.75)}
                            elevation={0}
                            sx={{
                                padding: 3,
                                height: 400,
                                borderRadius: 4,
                                background: 'white',
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    boxShadow: theme.shadows[8]
                                },
                                transition: 'box-shadow 0.3s ease'
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} mb={2} color="primary">
                                📁 Category-wise Applications
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart layout="vertical" data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" stroke="#888" />
                                    <YAxis type="category" dataKey="category" stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: theme.shadows[3],
                                            background: 'rgba(255, 255, 255, 0.96)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#ab47bc"
                                        radius={[0, 4, 4, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    {/* Applications by Hour */}
                    <Grid item xs={12} lg={6} xl={4}>
                        <Paper
                            component={motion.div}
                            variants={fadeIn('up', 'spring', 1.2, 0.75)}
                            elevation={0}
                            sx={{
                                padding: 3,
                                height: 400,
                                borderRadius: 4,
                                background: 'white',
                                boxShadow: theme.shadows[4],
                                '&:hover': {
                                    boxShadow: theme.shadows[8]
                                },
                                transition: 'box-shadow 0.3s ease'
                            }}
                        >
                            <Typography variant="h5" fontWeight={600} mb={2} color="primary">
                                🕒 Applications by Hour
                            </Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={hourData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="hour" stroke="#888" />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: 12,
                                            border: 'none',
                                            boxShadow: theme.shadows[3],
                                            background: 'rgba(255, 255, 255, 0.96)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="apps"
                                        fill="#ffa726"
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={1500}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>


            </Box>
        </Box>
    );
};

export default ApplicationGraphDashboard;