import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AdminDashboardContext } from '../../../Context/AdminContext/AdminDashboardContextProvider';
import Admin_DashboardJobSeekerTable from './Admin_DashboardJobSeekerTable';
import Admin_DashboardRecruiterTable from './Admin_DashboardRecruiterTable';
import Demo from './Admin_DashboardCharts/Activity';
import Activity from './Admin_DashboardCharts/Activity';
import SkillsPieChart from './SkillsPieChart';

const StatCard = ({ icon, title, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1, duration: 0.5 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all`}
    >
        <div className="p-6">
            <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-${color}-100`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <motion.p
                        className={`text-2xl font-bold text-${color}-600 mt-1`}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay * 0.1 + 0.2 }}
                    >
                        {value}
                    </motion.p>
                </div>
            </div>
        </div>
    </motion.div>
);

const Admin_DashboardContent = () => {
    const { stats, jobSeeker, recruiter } = useContext(AdminDashboardContext);

    // Process data for tables
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



    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                when: "beforeChildren"
            }
        }
    };

    const item = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        show: {
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
            transition: { duration: 0.2 }
        }
    };


    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your platform users and content</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
            >
                <StatCard
                    icon={<UsersIcon className="text-blue-500" />}
                    title="Total Job Seekers"
                    value={stats?.jobSeekerCount || 0}
                    color="blue"
                    delay={0}
                />
                <StatCard
                    icon={<BriefcaseIcon className="text-amber-500" />}
                    title="Total Recruiters"
                    value={stats?.recruiterCount || 0}
                    color="amber"
                    delay={1}
                />
                <StatCard
                    icon={<DocumentIcon className="text-green-500" />}
                    title="Active Jobs"
                    value={stats?.activeJobsCount || 0}
                    color="green"
                    delay={2}
                />
                <StatCard
                    icon={<ClockIcon className="text-purple-500" />}
                    title="Expired Jobs"
                    value={stats?.expiredJobsCount || 0}
                    color="purple"
                    delay={3}
                />
            </motion.div>

            {/* Tables Container */}
            <motion.div
                className="flex flex-col lg:flex-row gap-6 w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {/* Job Seekers Table */}
                <div className="flex-1 min-w-0">
                    <Admin_DashboardJobSeekerTable
                        data={jobSeekerRows}
                        title="Job Seekers"
                    />
                </div>

                {/* Recruiters Table */}
                <div className="flex-1 min-w-0">
                    <Admin_DashboardRecruiterTable
                        data={recruiterRows}
                        title="Recruiters"
                    />
                </div>
            </motion.div>
            <motion.div
                className='flex gap-6 mt-8 w-full'
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div
                    className='flex-8/5'
                    variants={item}
                    whileHover="hover"
                >
                    <Activity />
                </motion.div>

                <motion.div
                    className='flex-8/5'
                    variants={item}
                    whileHover="hover"
                    transition={{ delay: 0.15 }}
                >
                    <SkillsPieChart />
                </motion.div>
            </motion.div>
        </div>
    );
};

// Icons components
const UsersIcon = ({ className }) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const BriefcaseIcon = ({ className }) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const DocumentIcon = ({ className }) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ClockIcon = ({ className }) => (
    <svg className={`w-6 h-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Admin_DashboardContent;