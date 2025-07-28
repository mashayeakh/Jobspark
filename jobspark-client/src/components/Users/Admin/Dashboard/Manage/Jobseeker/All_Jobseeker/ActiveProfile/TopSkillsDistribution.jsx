import React, { useContext, useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { motion } from 'framer-motion';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { JobSeekerDashboardContext } from '../../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';
import CustomTooltip from '../../../../../../../../constants/CustomTooltip';

const TopSkillsDistribution = () => {
    const { stats } = useContext(JobSeekerDashboardContext);
    const [profiles, setProfiles] = useState(stats?.data?.allJobSeekers);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Skills Breakdown Data for Bar Chart
    const skillCounts = profiles?.flatMap(profile => profile?.skills || []).reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
    }, {});

    const skillChartData = Object.entries(skillCounts || {})
        ?.map(([name, count]) => ({ name, count }))
        ?.sort((a, b) => b.count - a.count);

    useEffect(() => {
        if (stats?.data?.allJobSeekers) {
            setProfiles(stats.data.allJobSeekers);
        }
    }, [stats]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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

    const barVariants = {
        hidden: { opacity: 0, scaleY: 0 },
        visible: (i) => ({
            opacity: 1,
            scaleY: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                type: 'spring'
            }
        })
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
        >
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Skills Distribution</h3>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs px-3 py-1.5 bg-indigo-100 text-indigo-600 rounded-md font-medium"
                    onClick={handleOpen}
                >
                    View All
                </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={skillChartData?.slice(0, 5)}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            tickMargin={10}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                        />
                        <Bar
                            dataKey="count"
                            fill="#6366F1"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                            animationBegin={0}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        >
                            {skillChartData?.slice(0, 5).map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={theme.palette.primary.main}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Material UI Dialog for full view */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: fullScreen ? 0 : 12,
                        padding: fullScreen ? 0 : '1rem'
                    }
                }}
            >
                <DialogTitle className="flex justify-between items-center">
                    <span className="text-xl font-semibold">Full Skills Distribution</span>
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="w-full h-[70vh] min-h-[400px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={skillChartData}
                                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                                layout="vertical"
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={theme.palette.divider}
                                    horizontal={true}
                                    vertical={false}
                                />
                                <XAxis
                                    type="number"
                                    tick={{ fontSize: 12 }}
                                    tickMargin={10}
                                />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={150}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill={theme.palette.primary.main}
                                    radius={[0, 4, 4, 0]}
                                    barSize={20}
                                    name="Number of Profiles"
                                    animationBegin={0}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {skillChartData?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={theme.palette.primary.main}
                                        />
                                    ))}
                                </Bar>
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="contained"
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
};

export default TopSkillsDistribution;