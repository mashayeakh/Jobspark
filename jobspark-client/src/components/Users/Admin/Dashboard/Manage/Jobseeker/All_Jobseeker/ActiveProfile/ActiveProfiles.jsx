import React, { useState, useEffect, useContext } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiUser, FiMail, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiBell, FiEye, FiDownload, FiEdit, FiTrendingUp } from 'react-icons/fi';
import { JobSeekerDashboardContext } from '../../../../../../../Context/AdminContext/JobSeekerDashboardContextProvider';
import { motion } from 'framer-motion';
import CompletenessChart from './CompletenessChart';
import TopSkillsDistribution from './TopSkillsDistribution';
import { COLORS } from '../../../../../../../../constants/Colors';
import ExperienceLevelsChart from './ExperienceLevelsChart';
import LocationChart from './LocationChart';
import RecentSignInActivity from './RecentSignInActivity';
import TableProfiles from './TableProfiles';

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const incrementTime = duration / end;

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{count}</span>;
};

const ActiveProfiles = () => {
    const { stats, active_profile, completeness } = useContext(JobSeekerDashboardContext);
    const [profiles, setProfiles] = useState(stats?.data?.allJobSeekers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [experienceFilter, setExperienceFilter] = useState('All');

    useEffect(() => {
        if (stats?.data?.allJobSeekers) {
            setProfiles(stats.data.allJobSeekers);
        }
    }, [stats]);

    // Derived data for charts and summaries
    const totalActiveProfiles = profiles?.filter(p => Number(p?.appliedApplicationCount) > 0).length;
    const totalProfiles = stats?.data?.totalJobSeekers;
    const completeProfiles = completeness?.completeProfiles;
    const total = completeness?.totalJobSeekers || 0;
    const incompleteProfiles = total - completeProfiles;

    const profileCompletenessChartData = [
        { name: 'Complete (>=90%)', value: completeProfiles },
        { name: 'Incomplete (<90%)', value: incompleteProfiles },
    ];

    // Skills Breakdown Data for Bar Chart
    const skillCounts = profiles?.flatMap(profile => profile?.skills || []).reduce((acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
    }, {});

    const skillChartData = Object.entries(skillCounts || {})?.map(([name, count]) => ({ name, count }))?.sort((a, b) => b.count - a.count);

    // Experience Level Data for Pie Chart
    const experienceLevelCounts = profiles?.reduce((acc, profile) => {
        acc[profile.experienceLevel] = (acc[profile.experienceLevel] || 0) + 1;
        return acc;
    }, {});
    const experienceChartData = Object.entries(experienceLevelCounts || {})?.map(([name, value]) => ({ name, value }));

    // Location Data (only active profiles) for Bar Chart
    const locationCounts = profiles?.reduce((acc, profile) => {
        const loc = profile?.location?.trim();
        if (loc) {
            acc[loc] = (acc[loc] || 0) + 1;
        }
        return acc;
    }, {});

    const locationChartData = Object.entries(locationCounts || [])?.map(([name, count]) => ({ name, count }))?.sort((a, b) => b.count - a.count);

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload?.length) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-3 shadow-lg rounded-lg border border-gray-200"
                >
                    <p className="font-semibold">{payload[0].payload.name}</p>
                    <p className="text-sm">{payload[0].value} {payload[0].value === 1 ? 'profile' : 'profiles'}</p>
                </motion.div>
            );
        }
        return null;
    };

    // Animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Job Seekers Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage and analyze job seeker profiles</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition duration-200 flex items-center"
                        >
                            <FiUser className="mr-2" />
                            Export Data
                        </motion.button>
                    </div>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="bg-white p-4 rounded-xl shadow-sm mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.div variants={cardVariants} className="md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div variants={cardVariants}>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </motion.div>
                        <motion.div variants={cardVariants}>
                            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                            <select
                                id="experience"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={experienceFilter}
                                onChange={(e) => setExperienceFilter(e.target.value)}
                            >
                                <option value="All">All Levels</option>
                                <option value="Junior">Junior</option>
                                <option value="Mid">Mid</option>
                                <option value="Senior">Senior</option>
                            </select>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Key Metrics Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Profiles Card */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 mr-4">
                                    <FiUser className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Profiles</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        <AnimatedCounter value={stats?.data?.totalJobSeekers || 0} />
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                                +<AnimatedCounter value={12} duration={500} /> today
                            </span>
                        </div>
                    </motion.div>

                    {/* Active Profiles Card */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                                    <FiCheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Active Profiles</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        <AnimatedCounter value={active_profile?.count || 0} />
                                    </p>
                                    {typeof totalActiveProfiles === 'number' && typeof totalProfiles === 'number' && totalProfiles > 0 ? (
                                        <div className="flex items-center mt-1">
                                            <span className="text-xs text-gray-500 mr-2">
                                                {Math.round((totalActiveProfiles / totalProfiles) * 100)}% of total
                                            </span>
                                            <FiTrendingUp className="text-green-500" size={14} />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 mt-1 text-yellow-600">Calculating...</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                                <span className="text-green-600 font-bold text-sm">
                                    +{Math.floor((active_profile?.count / stats?.data?.totalJobSeekers) * 100)}%
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Complete Profiles Card */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                                    <FiCheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Complete Profiles</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        <AnimatedCounter value={completeness?.completeProfiles || 0} />
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className="text-xs text-gray-500 mr-2">
                                            {completeness?.completionRate || 0}% of total
                                        </span>
                                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                            <motion.div
                                                className="bg-blue-500 h-1.5 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${completeness?.completionRate || 0}%` }}
                                                transition={{ duration: 1.5 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Activity Card */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                                    <FiClock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Recent Sign-Ins</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        <AnimatedCounter value={stats?.data?.recentSignInCount || 0} />
                                    </p>
                                    <div className="flex items-center mt-1">
                                        <span className="text-xs text-gray-500">Last 7 days</span>
                                        <span className="ml-2 text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-full">
                                            +<AnimatedCounter value={5} duration={800} /> today
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Profile Completeness Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <CompletenessChart />
                    </motion.div>

                    {/* Skills Distribution Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <TopSkillsDistribution />
                    </motion.div>
                </div>

                {/* Experience and Location Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Experience Level Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <ExperienceLevelsChart />
                    </motion.div>

                    {/* Location Distribution Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                        <LocationChart />
                    </motion.div>
                </div>

                {/* Recent Activity Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <RecentSignInActivity />
                </motion.div>

                {/* Job Seekers Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <TableProfiles />
                </motion.div>
            </div>
        </div>
    );
};

export default ActiveProfiles;