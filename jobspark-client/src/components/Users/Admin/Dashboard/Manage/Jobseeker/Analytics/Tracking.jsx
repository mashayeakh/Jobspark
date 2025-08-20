import { useContext, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { JobSeekerActivityContext } from "../../../../../../Context/AdminContext/JobSeekerActivityContextProvider";

// Dummy Data
// const topJobSeekers = [
//     { name: "Alice Johnson", applications: 25, successRate: 68 },
//     { name: "Bob Smith", applications: 20, successRate: 72 },
//     { name: "Charlie Brown", applications: 18, successRate: 61 },
//     { name: "Diana Prince", applications: 15, successRate: 85 },
//     { name: "Ethan Hunt", applications: 12, successRate: 78 },
// ];



// const 



// const topJobSeekers = 0;





const dailyActiveSeekers = [
    { day: "Mon", active: 120, avgTime: 45 },
    { day: "Tue", active: 180, avgTime: 52 },
    { day: "Wed", active: 150, avgTime: 48 },
    { day: "Thu", active: 200, avgTime: 55 },
    { day: "Fri", active: 170, avgTime: 50 },
    { day: "Sat", active: 90, avgTime: 38 },
    { day: "Sun", active: 60, avgTime: 32 },
];

const inactiveUsers = [
    { name: "Farhan Ahmed", lastActive: "45 days ago", email: "farhan@example.com" },
    { name: "Mina Rahman", lastActive: "60 days ago", email: "mina@example.com" },
    { name: "Rafiq Islam", lastActive: "35 days ago", email: "rafiq@example.com" },
    { name: "Tahmina Khan", lastActive: "50 days ago", email: "tahmina@example.com" },
    { name: "Shakil Hossain", lastActive: "42 days ago", email: "shakil@example.com" },
];

const skillsData = [
    { name: "React", value: 400, demand: 12 },
    { name: "Node.js", value: 300, demand: 9 },
    { name: "Python", value: 250, demand: 15 },
    { name: "AI/ML", value: 200, demand: 18 },
    { name: "SQL", value: 150, demand: 8 },
];

const qualificationsData = [
    { name: "Bachelor's", value: 500, avgSalary: 55000 },
    { name: "Master's", value: 200, avgSalary: 75000 },
    { name: "Diploma", value: 150, avgSalary: 45000 },
    { name: "PhD", value: 80, avgSalary: 95000 },
];

const locationData = [
    { name: "Dhaka", value: 500, growth: 12 },
    { name: "Rajshahi", value: 200, growth: 8 },
    { name: "Chittagong", value: 300, growth: 10 },
    { name: "Khulna", value: 150, growth: 6 },
    { name: "Sylhet", value: 120, growth: 9 },
];

const jobPrefData = [
    { category: "IT", applications: 400, avgSalary: 65000 },
    { category: "Finance", applications: 200, avgSalary: 70000 },
    { category: "Marketing", applications: 300, avgSalary: 55000 },
    { category: "Design", applications: 180, avgSalary: 60000 },
    { category: "Healthcare", applications: 220, avgSalary: 72000 },
];

const jobTypeData = [
    { name: "Remote", value: 250, satisfaction: 85 },
    { name: "Onsite", value: 400, satisfaction: 65 },
    { name: "Hybrid", value: 150, satisfaction: 78 },
];

const skillGapData = [
    { subject: 'AI/ML', jobDemand: 95, seekerSupply: 65, fullMark: 100 },
    { subject: 'Cloud', jobDemand: 85, seekerSupply: 70, fullMark: 100 },
    { subject: 'Cybersecurity', jobDemand: 90, seekerSupply: 55, fullMark: 100 },
    { subject: 'Data Science', jobDemand: 80, seekerSupply: 60, fullMark: 100 },
    { subject: 'DevOps', jobDemand: 75, seekerSupply: 50, fullMark: 100 },
];

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#E11D48", "#3B82F6", "#8B5CF6", "#EC4899"];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                <p className="font-bold text-gray-900">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                        {entry?.payload?.avgSalary && ` | Avg Salary: $${entry.payload.avgSalary.toLocaleString()}`}
                        {entry?.payload?.successRate && ` | Success Rate: ${entry.payload.successRate}%`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                <p className="font-bold">{payload[0].name}</p>
                <p className="text-sm">{payload[0].value} job seekers</p>
                {payload[0]?.payload?.avgSalary && (
                    <p className="text-sm">Avg Salary: ${payload[0].payload.avgSalary.toLocaleString()}</p>
                )}
            </div>
        );
    }
    return null;
};

const Tracking = () => {
    const [tab, setTab] = useState("activity");

    const { jActivity } = useContext(JobSeekerActivityContext);
    console.log("ACCCCCCCCCCC ", jActivity);
    const topJobSeekers = jActivity;

    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Job Seeker Analytics</h1>
                        <p className="text-gray-600 mt-2">
                            Track job seeker activity, skills, and preferences
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {["activity", "skills", "location", "preferences", "ai"].map((tabName) => (
                        <button
                            key={tabName}
                            onClick={() => setTab(tabName)}
                            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${tab === tabName
                                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Activity Tracking */}
                    {tab === "activity" && (
                        <motion.div
                            key="activity"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                                            📊
                                        </span>
                                        Top Active Job Seekers
                                    </h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={topJobSeekers}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#6B7280"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                interval={0}
                                            />
                                            <YAxis stroke="#6B7280" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar
                                                dataKey="totalApplications"
                                                fill="url(#colorApplications)"
                                                radius={[6, 6, 0, 0]}
                                            />
                                            <defs>
                                                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-green-100 p-2 rounded-lg mr-3">
                                            📈
                                        </span>
                                        Daily Active Job Seekers
                                    </h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dailyActiveSeekers}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="day" stroke="#6B7280" />
                                            <YAxis stroke="#6B7280" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey="active"
                                                stroke="url(#colorActive)"
                                                strokeWidth={3}
                                                dot={{ r: 5, fill: "#22C55E" }}
                                                activeDot={{ r: 8, fill: "#22C55E" }}
                                            />
                                            <defs>
                                                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 lg:col-span-2"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-red-100 p-2 rounded-lg mr-3">
                                            ⚠️
                                        </span>
                                        Inactive Users (30+ days)
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 text-gray-600 font-medium">Name</th>
                                                    <th className="text-left py-3 text-gray-600 font-medium">Last Active</th>
                                                    <th className="text-left py-3 text-gray-600 font-medium">Email</th>
                                                    <th className="text-left py-3 text-gray-600 font-medium">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inactiveUsers.map((user, idx) => (
                                                    <motion.tr
                                                        key={idx}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 * idx }}
                                                        className="border-b border-gray-100 hover:bg-gray-50"
                                                    >
                                                        <td className="py-4 text-gray-900">{user.name}</td>
                                                        <td className="py-4 text-gray-600">{user.lastActive}</td>
                                                        <td className="py-4 text-gray-600">{user.email}</td>
                                                        <td className="py-4">
                                                            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200">
                                                                Remind
                                                            </button>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Skills & Qualifications */}
                    {tab === "skills" && (
                        <motion.div
                            key="skills"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-blue-100 p-2 rounded-lg mr-3">
                                            🔧
                                        </span>
                                        Common Skills
                                    </h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={skillsData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                                labelLine={false}
                                            >
                                                {skillsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-purple-100 p-2 rounded-lg mr-3">
                                            🎓
                                        </span>
                                        Qualifications
                                    </h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={qualificationsData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            >
                                                {qualificationsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Location-Based Insights */}
                    {tab === "location" && (
                        <motion.div
                            key="location"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 gap-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-orange-100 p-2 rounded-lg mr-3">
                                            📍
                                        </span>
                                        Top Cities by Job Seekers
                                    </h2>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={locationData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="name" stroke="#6B7280" />
                                            <YAxis stroke="#6B7280" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar
                                                dataKey="value"
                                                fill="url(#colorLocation)"
                                                radius={[6, 6, 0, 0]}
                                            />
                                            <defs>
                                                <linearGradient id="colorLocation" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#F97316" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Job Preferences */}
                    {tab === "preferences" && (
                        <motion.div
                            key="preferences"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-pink-100 p-2 rounded-lg mr-3">
                                            💼
                                        </span>
                                        Popular Job Categories
                                    </h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={jobPrefData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="category" stroke="#6B7280" />
                                            <YAxis stroke="#6B7280" />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Bar
                                                dataKey="applications"
                                                fill="url(#colorCategory)"
                                                radius={[6, 6, 0, 0]}
                                            />
                                            <defs>
                                                <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#E11D48" stopOpacity={0.8} />
                                                    <stop offset="100%" stopColor="#E11D48" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                        <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                                            🏢
                                        </span>
                                        Job Type Preferences
                                    </h2>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={jobTypeData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            >
                                                {jobTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* AI Insights */}
                    {tab === "ai" && (
                        <motion.div
                            key="ai"
                            variants={tabVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl rounded-xl overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                                            🔍
                                        </div>
                                        <h2 className="text-xl font-bold">Skill Gap Analysis</h2>
                                    </div>
                                    <p className="text-indigo-100 mb-4">
                                        Compares job postings vs seeker skills to highlight gaps and opportunities for upskilling.
                                    </p>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <RadarChart data={skillGapData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis />
                                            <Radar name="Job Demand" dataKey="jobDemand" stroke="#4ADE80" fill="#4ADE80" fillOpacity={0.3} />
                                            <Radar name="Seeker Supply" dataKey="seekerSupply" stroke="#F87171" fill="#F87171" fillOpacity={0.3} />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-xl rounded-xl overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                                            ⚖️
                                        </div>
                                        <h2 className="text-xl font-bold">Demand-Supply Mismatch</h2>
                                    </div>
                                    <p className="text-pink-100 mb-4">
                                        Shows oversupply of candidates in some fields vs high-demand fields with talent shortages.
                                    </p>
                                    <div className="mt-4">
                                        <div className="flex justify-between mb-2">
                                            <span>High Demand Fields</span>
                                            <span>12% gap</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2.5">
                                            <div className="bg-white h-2.5 rounded-full" style={{ width: "88%" }}></div>
                                        </div>

                                        <div className="flex justify-between mb-2 mt-4">
                                            <span>Oversupplied Fields</span>
                                            <span>32% surplus</span>
                                        </div>
                                        <div className="w-full bg-white/20 rounded-full h-2.5">
                                            <div className="bg-white h-2.5 rounded-full" style={{ width: "132%" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-xl rounded-xl overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-white/20 p-2 rounded-lg mr-3">
                                            🔮
                                        </div>
                                        <h2 className="text-xl font-bold">Predictive Trends</h2>
                                    </div>
                                    <p className="text-teal-100 mb-4">
                                        Forecasts which roles & skills will be in demand based on market analysis and hiring patterns.
                                    </p>
                                    <div className="space-y-4 mt-4">
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>AI/ML Specialists</span>
                                                <span>+24%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2.5">
                                                <div className="bg-white h-2.5 rounded-full" style={{ width: "85%" }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>Cloud Engineers</span>
                                                <span>+18%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2.5">
                                                <div className="bg-white h-2.5 rounded-full" style={{ width: "70%" }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span>Cybersecurity</span>
                                                <span>+22%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2.5">
                                                <div className="bg-white h-2.5 rounded-full" style={{ width: "80%" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

    );
}

export default Tracking;
