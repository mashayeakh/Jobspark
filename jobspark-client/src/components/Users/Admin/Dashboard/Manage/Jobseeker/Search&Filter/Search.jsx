import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { JobSeekerVerifiedContext } from '../../../../../../Context/AdminContext/JobSeekerVerifiedContextProvider';

const dummyUsers = [
    { id: 1, name: 'John Doe', email: 'john@email.com', status: 'Verified', role: 'Admin', location: 'Dhaka', lastActive: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@email.com', status: 'Unverified', role: 'Customer', location: 'CTG', lastActive: '5 days ago' },
    { id: 3, name: 'Karim Khan', email: 'karim@email.com', status: 'Verified', role: 'Admin', location: 'Sylhet', lastActive: '1 hour ago' },
    { id: 4, name: 'Rahim Mia', email: 'rahim@email.com', status: 'Unverified', role: 'Customer', location: 'Rajshahi', lastActive: '3 weeks ago' },
    { id: 5, name: 'Ayesha Akter', email: 'ayesha@email.com', status: 'Verified', role: 'Admin', location: 'Dhaka', lastActive: '30 minutes ago' },
    { id: 6, name: 'Mehedi Hasan', email: 'mehedi@email.com', status: 'Unverified', role: 'Customer', location: 'CTG', lastActive: '2 months ago' },
    { id: 7, name: 'Shila Rani', email: 'shila@email.com', status: 'Verified', role: 'Admin', location: 'Sylhet', lastActive: 'Just now' },
    { id: 8, name: 'Tania Islam', email: 'tania@email.com', status: 'Unverified', role: 'Customer', location: 'CTG', lastActive: '1 week ago' },
    { id: 9, name: 'Sajid Hossain', email: 'sajid@email.com', status: 'Verified', role: 'Customer', location: 'Barisal', lastActive: 'Yesterday' },
    // { id: 10, name: 'Arif Chowdhury', email: 'arif@email.com', status: 'Unverified', role: 'Admin', location: 'Dhaka', lastActive: '45 minutes ago' },
];




const statusColors = {
    Verified: 'bg-green-100 text-green-800',
    Unverified: 'bg-yellow-100 text-yellow-800'
};

const roleColors = {
    Admin: 'bg-purple-100 text-purple-800',
    Customer: 'bg-blue-100 text-blue-800'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Search = () => {

    const { searchJobSeeker } = useContext(JobSeekerVerifiedContext);

    console.log("SSS ", searchJobSeeker);
    console.log("all users ", searchJobSeeker?.data?.allUsers?.length);

    const allUser = searchJobSeeker?.data?.allUsers?.length;
    const verified = searchJobSeeker?.data?.verifiedUsers?.length;
    const unverified = searchJobSeeker?.data?.unverifiedUsers;
    const adminCount = searchJobSeeker?.data?.admin;
    const jobSeekerCount = searchJobSeeker?.data?.jobSeekerCount;
    const recruiterCount = searchJobSeeker?.data?.recruiterCount;
    console.log("Admin", adminCount);


    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [role, setRole] = useState('All');
    const [location, setLocation] = useState('All');
    const [reminded, setReminded] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [highlightedGraphs, setHighlightedGraphs] = useState(['total', 'verified', 'unverified', 'admin']);

    useEffect(() => {
        // Determine which graphs to highlight based on filters
        const highlights = [];

        if (search === '' && status === 'All' && role === 'All' && location === 'All') {
            highlights.push('total', 'verified', 'unverified', 'admin');
        } else {
            highlights.push('total');

            if (status !== 'All') {
                if (status === 'Verified') highlights.push('verified');
                if (status === 'Unverified') highlights.push('unverified');
            }

            if (role !== 'All' && role === 'Admin') {
                highlights.push('admin');
            }
        }

        setHighlightedGraphs(highlights);
    }, [search, status, role, location]);

    const handleVerification = (id) => {
        setReminded((prev) => [...prev, id]);

        const button = document.getElementById(`verify-btn-${id}`);
        if (button) {
            button.classList.add('animate-ping');
            setTimeout(() => {
                button.classList.remove('animate-ping');
            }, 500);
        }
    };

    const filteredUsers = dummyUsers.filter(user => {
        return (
            user.name.toLowerCase().includes(search.toLowerCase()) &&
            (status === 'All' || user.status === status) &&
            (role === 'All' || user.role === role) &&
            (location === 'All' || user.location === location)
        );
    });

    const resetFilters = () => {
        setSearch('');
        setStatus('All');
        setRole('All');
        setLocation('All');
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
    });

    // Data for charts
    const totalUsers = dummyUsers.length;
    const verifiedUsers = dummyUsers.filter(u => u.status === 'Verified').length;
    const unverifiedUsers = dummyUsers.filter(u => u.status === 'Unverified').length;
    const adminUsers = dummyUsers.filter(u => u.role === 'Admin').length;

    const pieData = [
        { name: 'Verified', value: verified },
        { name: 'Unverified', value: unverified },
    ];

    const roleData = [
        { name: 'Admin', value: adminUsers },
        { name: 'JobSeeker', value: jobSeekerCount.length },
        { name: 'Recruiter', value: recruiterCount.length },
    ];

    const barData = [
        { name: 'Total Users', value: allUser },
        { name: 'Verified', value: verifiedUsers },
        { name: 'Unverified', value: unverifiedUsers },
        { name: 'Admins', value: adminUsers },
        // { name: 'Admins', value: adminUsers },
    ];

    const filteredVerified = filteredUsers.filter(u => u.status === 'Verified').length;
    const filteredUnverified = filteredUsers.filter(u => u.status === 'Unverified').length;
    const filteredAdmins = filteredUsers.filter(u => u.role === 'Admin').length;

    const filteredPieData = [
        { name: 'Verified', value: filteredVerified },
        { name: 'Unverified', value: filteredUnverified },
    ];

    const filteredRoleData = [
        { name: 'Admin', value: adminCount },
        { name: 'Jobseeker', value: jobSeekerCount.length },
        { name: 'Recruiter', value: recruiterCount.length },
    ];

    const filteredBarData = [
        { name: 'Filtered Users', value: filteredUsers.length },
        { name: 'Verified', value: filteredVerified },
        { name: 'Unverified', value: filteredUnverified },
        { name: 'Admins', value: filteredAdmins },
    ];

    const isHighlighted = (graphName) => highlightedGraphs.includes(graphName);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 max-w-7xl mx-auto"
        >
            <div className="flex justify-between items-center mb-8">
                <motion.h2
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-gray-800"
                >
                    User Management Dashboard
                </motion.h2>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <button>Export Data</button>
                </motion.div>
            </div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm"
            >
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option>All Status</option>
                    <option>Verified</option>
                    <option>Unverified</option>
                </select>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Customer</option>
                </select>

                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option>All Locations</option>
                    <option>Dhaka</option>
                    <option>CTG</option>
                    <option>Sylhet</option>
                    <option>Rajshahi</option>
                    <option>Barisal</option>
                </select>

                <motion.button
                    onClick={resetFilters}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-3 text-gray-700 font-medium transition-colors"
                >
                    Reset Filters
                </motion.button>
            </motion.div>

            {/* Charts Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
                {/* Total Users Pie Chart */}
                <motion.div
                    animate={{
                        scale: isHighlighted('total') ? 1.05 : 1,
                        boxShadow: isHighlighted('total') ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white p-4 rounded-xl ${isHighlighted('total') ? 'ring-2 ring-indigo-500' : ''}`}
                >
                    <h3 className="text-center font-medium text-gray-700 mb-2">Total Users</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ name: 'Total', value: allUser }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    <Cell fill="#4F46E5" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-2xl font-bold text-gray-800">{allUser}</p>
                </motion.div>

                {/* Verified Users Pie Chart */}
                <motion.div
                    animate={{
                        scale: isHighlighted('verified') ? 1.05 : 1,
                        boxShadow: isHighlighted('verified') ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white p-4 rounded-xl ${isHighlighted('verified') ? 'ring-2 ring-green-500' : ''}`}
                >
                    <h3 className="text-center font-medium text-gray-700 mb-2">Verified Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-gray-600">
                        <span className="font-bold text-green-600">{verified}</span> Verified •
                        <span className="font-bold text-yellow-600"> {unverified}</span> Unverified
                    </p>
                </motion.div>


                {/* Admin Users Bar Chart */}
                <motion.div
                    animate={{
                        scale: isHighlighted('admin') ? 1.05 : 1,
                        boxShadow: isHighlighted('admin') ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white p-4 rounded-xl ${isHighlighted('admin') ? 'ring-2 ring-purple-500' : ''}`}
                >
                    <h3 className="text-center font-medium text-gray-700 mb-2">User Roles</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredRoleData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8">
                                    {filteredRoleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#7C3AED' : '#3B82F6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-gray-600">
                        <span className="font-bold text-purple-600">{adminCount}</span> Admins •
                        <span className="font-bold text-blue-600"> {jobSeekerCount.length}</span> Job Seeker
                        <span className="font-bold text-blue-600"> {recruiterCount.length}</span> Recruiter
                    </p>
                </motion.div>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="overflow-x-auto bg-white rounded-xl shadow-sm"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => requestSort('name')}
                            >
                                <div className="flex items-center">
                                    Name
                                    {sortConfig.key === 'name' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => requestSort('status')}
                            >
                                <div className="flex items-center">
                                    Status
                                    {sortConfig.key === 'status' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => requestSort('role')}
                            >
                                <div className="flex items-center">
                                    Role
                                    {sortConfig.key === 'role' && (
                                        <span className="ml-1">
                                            {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Active
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                            {sortedUsers.length > 0 ? (
                                sortedUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.3 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[user.status]}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.lastActive}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {user.status === 'Verified' ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View Details
                                                </motion.button>
                                            ) : reminded.includes(user.id) ? (
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-gray-500 italic flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    Pending
                                                </motion.span>
                                            ) : (
                                                <motion.button
                                                    id={`verify-btn-${user.id}`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="text-yellow-600 hover:text-yellow-800 flex items-center"
                                                    onClick={() => handleVerification(user.id)}
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                                    </svg>
                                                    Verify Now
                                                </motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        No users found matching your criteria.
                                        <motion.button
                                            onClick={resetFilters}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="ml-2 text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            Reset filters
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>

            {/* Pagination */}
            {sortedUsers.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-between mt-6 px-4 py-3 bg-white rounded-xl shadow-sm"
                >
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, sortedUsers.length)}</span> of{' '}
                                <span className="font-medium">{sortedUsers.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <a
                                    href="#"
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    aria-current="page"
                                    className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                >
                                    1
                                </a>
                                <a
                                    href="#"
                                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                >
                                    2
                                </a>
                                <a
                                    href="#"
                                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                >
                                    3
                                </a>
                                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                </span>
                                <a
                                    href="#"
                                    className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                >
                                    8
                                </a>
                                <a
                                    href="#"
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </nav>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Search;