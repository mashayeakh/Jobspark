import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDashboardContext } from '../../../Context/AdminContext/AdminDashboardContextProvider';
import Admin_DashboardJobSeekerTable from './Admin_DashboardJobSeekerTable';
import Admin_DashboardRecruiterTable from './Admin_DashboardRecruiterTable';
import Demo from './Admin_DashboardCharts/Activity';
import Activity from './Admin_DashboardCharts/Activity';
import SkillsPieChart from './SkillsPieChart';

const StatCard = ({ icon, title, value, color, trend, delay, onClick }) => {
    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
        green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
        red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' }
    };

    const currentColor = colors[color] || colors.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
                delay: delay * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
            }}
            whileHover={{ 
                y: -5, 
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative bg-white rounded-2xl shadow-lg border-2 ${currentColor.border} overflow-hidden group cursor-pointer transform transition-all duration-300 hover:shadow-xl`}
        >
            {/* Animated background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white to-${currentColor.bg.split('-')[1]}-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative p-6 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <motion.div 
                            className={`p-3 rounded-xl ${currentColor.bg} backdrop-blur-sm`}
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {icon}
                        </motion.div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
                            <motion.p
                                className={`text-3xl font-bold ${currentColor.text} mt-1`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: delay * 0.1 + 0.3, type: "spring" }}
                            >
                                {value?.toLocaleString()}
                            </motion.p>
                        </div>
                    </div>
                    
                    {/* Trend indicator */}
                    {trend && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: delay * 0.1 + 0.5 }}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                                trend.value > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}
                        >
                            <span className="text-xs font-semibold">
                                {trend.value > 0 ? '↗' : '↘'} {Math.abs(trend.value)}%
                            </span>
                        </motion.div>
                    )}
                </div>
                
                {/* Progress bar for visual interest */}
                <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: delay * 0.1 + 0.7, duration: 1.5, ease: "easeOut" }}
                />
            </div>
        </motion.div>
    );
};

const MetricCard = ({ title, value, change, color, icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay * 0.1 }}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-lg font-semibold text-gray-800">{value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-${color}-100 text-${color}-600`}>
                {icon}
            </div>
        </div>
        {change && (
            <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change > 0 ? '↑' : '↓'} {Math.abs(change)}% from last week
            </p>
        )}
    </motion.div>
);

const Admin_DashboardContent = () => {
    const { stats, jobSeeker, recruiter } = useContext(AdminDashboardContext);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // Enhanced stats with trend data
    const enhancedStats = {
        ...stats,
        jobSeekerCount: stats?.jobSeekerCount || 0,
        recruiterCount: stats?.recruiterCount || 0,
        activeJobsCount: stats?.activeJobsCount || 0,
        expiredJobsCount: stats?.expiredJobsCount || 0,
        trends: {
            jobSeeker: { value: 12.5 },
            recruiter: { value: 8.3 },
            activeJobs: { value: -2.1 },
            expiredJobs: { value: 15.7 }
        }
    };

    const jobSeekerRows = jobSeeker?.data?.map(seeker => ({
        name: seeker?.Name || 'N/A',
        email: seeker?.Email || 'N/A',
        location: seeker?.Location || 'N/A',
        status: seeker?.Status || 'N/A',
        lastSignIn: seeker?.Last_SignIn || 'N/A',
        details: [
            { label: 'Experience Level', value: seeker?.ExperienceLevel || 'N/A' },
            { label: 'Skills', value: seeker?.Skills || 'N/A' },
            { label: 'Profile Complete', value: seeker?.isProfileComplete ? 'Yes' : 'No' },
            { label: 'Applied Jobs', value: seeker?.Applied_Jobs || 0 },
        ],
    })) || [];

    const recruiterRows = recruiter?.data?.map((rec) => ({
        name: rec?.Name || 'N/A',
        email: rec?.Email || 'N/A',
        location: rec?.Location || 'N/A',
        status: rec?.Status || 'N/A',
        jobsPosted: rec?.JobsCount || 0,
        lastActivity: rec?.lastSignIn || 'N/A',
        details: [
            { label: 'Company', value: rec?.Company || 'N/A' },
            { label: 'Role', value: rec?.role || 'N/A' },
            { label: 'Jobs Posted', value: rec?.JobsCount || 0 },
            { label: 'Active Listings', value: rec?.ActiveListings || 0 },
        ],
    })) || [];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                when: "beforeChildren"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            scale: 1.02,
            y: -5,
            transition: { duration: 0.3 }
        }
    };

    const loaderVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.5 }
        }
    };

    const dotVariants = {
        hidden: { y: 0, opacity: 0, scale: 0.5 },
        visible: (i) => ({
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
            }
        })
    };

    const handleStatClick = (statType) => {
        console.log(`Clicked on ${statType}`);
        // Add your click handler logic here
    };

    return (
        <>
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center z-50 backdrop-blur-sm"
                        variants={loaderVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="flex space-x-3 mb-8"
                            initial="hidden"
                            animate="visible"
                        >
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-4 h-4 rounded-full"
                                    style={{
                                        backgroundColor: ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'][i % 5]
                                    }}
                                    variants={dotVariants}
                                    custom={i}
                                />
                            ))}
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="text-center"
                        >
                            <motion.h2
                                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                Admin Dashboard
                            </motion.h2>
                            <motion.p
                                className="text-gray-600 text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                Loading analytics and insights...
                            </motion.p>
                        </motion.div>
                        
                        {/* Progress bar */}
                        <motion.div
                            className="w-64 h-1 bg-gray-200 rounded-full mt-8 overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                        >
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={isLoading ? {} : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <motion.h1 
                                    className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isLoading ? {} : { opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Admin Dashboard
                                </motion.h1>
                                <motion.p 
                                    className="text-gray-600 mt-2 text-lg"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isLoading ? {} : { opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Real-time analytics and user management
                                </motion.p>
                            </div>
                            
                            {/* Search and Filter */}
                            <motion.div 
                                className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={isLoading ? {} : { opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                                <select 
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={activeFilter}
                                    onChange={(e) => setActiveFilter(e.target.value)}
                                >
                                    <option value="all">All Users</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="recent">Recent</option>
                                </select>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isLoading ? {} : "visible"}
                    >
                        <StatCard
                            icon={<UsersIcon className="text-blue-600 w-6 h-6" />}
                            title="Total Job Seekers"
                            value={enhancedStats.jobSeekerCount}
                            color="blue"
                            trend={enhancedStats.trends?.jobSeeker}
                            delay={0}
                            onClick={() => handleStatClick('jobSeekers')}
                        />
                        <StatCard
                            icon={<BriefcaseIcon className="text-amber-600 w-6 h-6" />}
                            title="Total Recruiters"
                            value={enhancedStats.recruiterCount}
                            color="amber"
                            trend={enhancedStats.trends?.recruiter}
                            delay={1}
                            onClick={() => handleStatClick('recruiters')}
                        />
                        <StatCard
                            icon={<DocumentIcon className="text-green-600 w-6 h-6" />}
                            title="Active Jobs"
                            value={enhancedStats.activeJobsCount}
                            color="green"
                            trend={enhancedStats.trends?.activeJobs}
                            delay={2}
                            onClick={() => handleStatClick('activeJobs')}
                        />
                        <StatCard
                            icon={<ClockIcon className="text-purple-600 w-6 h-6" />}
                            title="Expired Jobs"
                            value={enhancedStats.expiredJobsCount}
                            color="purple"
                            trend={enhancedStats.trends?.expiredJobs}
                            delay={3}
                            onClick={() => handleStatClick('expiredJobs')}
                        />
                    </motion.div>

                    {/* Quick Metrics */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        initial={{ opacity: 0 }}
                        animate={isLoading ? {} : { opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <MetricCard
                            title="Avg. Applications"
                            value="24"
                            change={5.2}
                            color="blue"
                            icon={<TrendingUpIcon className="w-4 h-4" />}
                            delay={0}
                        />
                        <MetricCard
                            title="Response Rate"
                            value="68%"
                            change={2.1}
                            color="green"
                            icon={<CheckIcon className="w-4 h-4" />}
                            delay={1}
                        />
                        <MetricCard
                            title="New This Week"
                            value="42"
                            change={-1.5}
                            color="amber"
                            icon={<UserAddIcon className="w-4 h-4" />}
                            delay={2}
                        />
                        <MetricCard
                            title="Satisfaction"
                            value="4.8/5"
                            change={0.3}
                            color="purple"
                            icon={<StarIcon className="w-4 h-4" />}
                            delay={3}
                        />
                    </motion.div>

                    {/* Charts Section */}
                    <motion.div
                        className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate={isLoading ? {} : "visible"}
                    >
                        <motion.div
                            variants={itemVariants}
                            whileHover="hover"
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">User Activity</h3>
                                <Activity />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover="hover"
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills Distribution</h3>
                                <SkillsPieChart />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Tables Section */}
                    <motion.div
                        className="flex flex-col lg:flex-row gap-6 w-full"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isLoading ? {} : { opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        {/* Job Seekers Table */}
                        <div className="flex-1 min-w-0">
                            <Admin_DashboardJobSeekerTable
                                data={jobSeekerRows}
                                title="Job Seekers"
                                searchTerm={searchTerm}
                                filter={activeFilter}
                            />
                        </div>

                        {/* Recruiters Table */}
                        <div className="flex-1 min-w-0">
                            <Admin_DashboardRecruiterTable
                                data={recruiterRows}
                                title="Recruiters"
                                searchTerm={searchTerm}
                                filter={activeFilter}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
};

// Enhanced Icons
const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const BriefcaseIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const DocumentIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SearchIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const TrendingUpIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const UserAddIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

const StarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

export default Admin_DashboardContent;