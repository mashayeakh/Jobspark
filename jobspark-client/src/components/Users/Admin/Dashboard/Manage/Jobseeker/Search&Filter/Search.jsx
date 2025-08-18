import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { JobSeekerVerifiedContext } from '../../../../../../Context/AdminContext/JobSeekerVerifiedContextProvider';

const statusColors = {
    Verified: 'bg-green-100 text-green-800',
    Unverified: 'bg-yellow-100 text-yellow-800'
};

const roleColors = {
    Admin: 'bg-purple-100 text-purple-800',
    JobSeeker: 'bg-blue-100 text-blue-800',
    Recruiter: 'bg-red-100 text-red-800'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Search = () => {
    const { searchJobSeeker } = useContext(JobSeekerVerifiedContext);

    // Extract data from context
    const allUsers = searchJobSeeker?.data?.allUsers || [];
    const allUserCount = allUsers.length;
    const verifiedCount = searchJobSeeker?.data?.verifiedUsers?.length || 0;
    const unverifiedCount = searchJobSeeker?.data?.unverifiedUsers?.length || 0;
    const adminCount = searchJobSeeker?.data?.admin?.length || 0;
    const jobSeekerCount = searchJobSeeker?.data?.jobSeekerCount?.length || 0;
    const recruiterCount = searchJobSeeker?.data?.recruiterCount?.length || 0;

    // Filters & sorting
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [role, setRole] = useState('All');
    const [location, setLocation] = useState('All');
    const [reminded, setReminded] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [highlightedGraphs, setHighlightedGraphs] = useState(['total', 'verified', 'unverified', 'roles']);

    // Pagination state (NEW)
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10; // show 10 rows per page

    useEffect(() => {
        // Determine which graphs to highlight based on filters
        const highlights = [];
        if (search === '' && status === 'All' && role === 'All' && location === 'All') {
            highlights.push('total', 'verified', 'unverified', 'roles');
        } else {
            highlights.push('total');
            if (status !== 'All') {
                if (status === 'Verified') highlights.push('verified');
                if (status === 'Unverified') highlights.push('unverified');
            }
            if (role !== 'All') {
                highlights.push('roles');
            }
        }
        setHighlightedGraphs(highlights);
    }, [search, status, role, location]);

    // When filters or search change, jump back to page 1 (IMPORTANT)
    useEffect(() => {
        setCurrentPage(1);
    }, [search, status, role, location, sortConfig]);

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

    // Filter users
    const filteredUsers = allUsers.filter(user => {
        const query = search.toLowerCase();
        const matchesSearch =
            (user.name || '').toLowerCase().includes(query) ||
            (user.email || '').toLowerCase().includes(query) ||
            (Array.isArray(user.skills) ? user.skills.join(', ').toLowerCase() : '').includes(query);

        const isVerified = !!user.jobSeekerProfile?.isVerified;
        const matchesStatus =
            status === 'All' ||
            (status === 'Verified' && isVerified) ||
            (status === 'Unverified' && !isVerified);

        const roleName = user.isAdmin ? 'Admin' : 'JobSeeker';
        const matchesRole = role === 'All' || role === roleName;

        const matchesLocation =
            location === 'All' ||
            (user.location || '').toLowerCase().includes(location.toLowerCase());

        return matchesSearch && matchesStatus && matchesRole && matchesLocation;
    });

    const resetFilters = () => {
        setSearch('');
        setStatus('All');
        setRole('All');
        setLocation('All');
    };

    // Sorting
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue, bValue;
        if (sortConfig.key === 'isVerified') {
            aValue = a.jobSeekerProfile?.isVerified ? 1 : 0;
            bValue = b.jobSeekerProfile?.isVerified ? 1 : 0;
        } else if (sortConfig.key === 'role') {
            aValue = a.isAdmin ? 'Admin' : 'JobSeeker';
            bValue = b.isAdmin ? 'Admin' : 'JobSeeker';
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue === undefined || aValue === null) aValue = '';
        if (bValue === undefined || bValue === null) bValue = '';

        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
    });

    // ===== PAGINATION LOGIC (NEW) =====
    const totalResults = sortedUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
    const clampedCurrent = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (clampedCurrent - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalResults);
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        setCurrentPage(p);
    };

    const pageNumbers = (() => {
        // compact pager: 1, 2, 3, ..., N
        const pages = [];
        const maxToShow = 7;
        if (totalPages <= maxToShow) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        // Always show 1, last, current ±1, and ellipses
        const add = (n) => pages.push(n);
        add(1);
        if (clampedCurrent > 3) add('…');
        const start = Math.max(2, clampedCurrent - 1);
        const stop = Math.min(totalPages - 1, clampedCurrent + 1);
        for (let i = start; i <= stop; i++) add(i);
        if (clampedCurrent < totalPages - 2) add('…');
        add(totalPages);
        return pages;
    })();

    // Chart data
    const pieData = [
        { name: 'Verified', value: verifiedCount },
        { name: 'Unverified', value: unverifiedCount },
    ];

    const roleData = [
        { name: 'Admin', value: adminCount },
        { name: 'JobSeeker', value: jobSeekerCount },
        { name: 'Recruiter', value: recruiterCount },
    ];

    const filteredVerified = filteredUsers.filter(u => u.jobSeekerProfile?.isVerified).length;
    const filteredUnverified = filteredUsers.filter(u => !u.jobSeekerProfile?.isVerified).length;
    const filteredAdmins = filteredUsers.filter(u => u.isAdmin).length;
    const filteredJobSeekers = filteredUsers.filter(u => !u.isAdmin).length;

    const filteredPieData = [
        { name: 'Verified', value: filteredVerified },
        { name: 'Unverified', value: filteredUnverified },
    ];

    const filteredRoleData = [
        { name: 'Admin', value: filteredAdmins },
        { name: 'JobSeeker', value: filteredJobSeekers },
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
                        placeholder="Search by name, email or skills..."
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
                    <option>All</option>
                    <option>Verified</option>
                    <option>Unverified</option>
                </select>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option>All</option>
                    <option>Admin</option>
                    <option>JobSeeker</option>
                </select>

                <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option>All</option>
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

            {/* Charts */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {/* Total Users */}
                <motion.div
                    animate={{
                        scale: isHighlighted('total') ? 1.05 : 1,
                        boxShadow: isHighlighted('total')
                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white p-4 rounded-xl ${isHighlighted('total') ? 'ring-2 ring-indigo-500' : ''}`}
                >
                    <h3 className="text-center font-medium text-gray-700 mb-2">Total Users</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ name: 'Total', value: allUserCount }]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    <Cell fill="#4F46E5" />
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} users`, 'Total']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-2xl font-bold text-gray-800">{allUserCount}</p>
                </motion.div>

                {/* Verified Status */}
                <motion.div
                    animate={{
                        scale: isHighlighted('verified') ? 1.05 : 1,
                        boxShadow: isHighlighted('verified')
                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
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
                                <Tooltip formatter={(value, _, entry) => [`${value} users`, entry?.payload?.name || 'Count']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-gray-600">
                        <span className="font-bold text-green-600">{verifiedCount}</span> Verified •
                        <span className="font-bold text-yellow-600"> {unverifiedCount}</span> Unverified
                    </p>
                </motion.div>

                {/* Filtered Verification */}
                <motion.div
                    animate={{
                        scale: isHighlighted('unverified') ? 1.05 : 1,
                        boxShadow: isHighlighted('unverified')
                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white p-4 rounded-xl ${isHighlighted('unverified') ? 'ring-2 ring-yellow-500' : ''}`}
                >
                    <h3 className="text-center font-medium text-gray-700 mb-2">Filtered Verification</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredPieData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                                <Bar dataKey="value" fill="#8884d8">
                                    {filteredPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-gray-600">
                        <span className="font-bold">{filteredVerified}</span> Verified •
                        <span className="font-bold"> {filteredUnverified}</span> Unverified
                    </p>
                </motion.div>

                {/* Roles */}
                <motion.div
                    animate={{
                        scale: isHighlighted('roles') ? 1.05 : 1,
                        boxShadow: isHighlighted('roles')
                            ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`bg-white p-4 rounded-xl ${isHighlighted('roles') ? 'ring-2 ring-purple-500' : ''}`}
                >
                    <h3 className="text-center font-medium text-gray-700 mb-2">User Roles</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredRoleData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                                <Bar dataKey="value" fill="#8884d8">
                                    {filteredRoleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#7C3AED' : '#3B82F6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-gray-600">
                        <span className="font-bold text-purple-600">{filteredAdmins}</span> Admins •
                        <span className="font-bold text-blue-600"> {filteredJobSeekers}</span> JobSeekers
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
                                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => requestSort('email')}
                            >
                                <div className="flex items-center">
                                    Email
                                    {sortConfig.key === 'email' && (
                                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => requestSort('isVerified')}
                            >
                                <div className="flex items-center">
                                    Status
                                    {sortConfig.key === 'isVerified' && (
                                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
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
                                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => requestSort('location')}
                            >
                                <div className="flex items-center">
                                    Location
                                    {sortConfig.key === 'location' && (
                                        <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                                    )}
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Skills
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Experience
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => (
                                    <motion.tr
                                        key={user._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.3 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.jobSeekerProfile?.isVerified ? statusColors.Verified : statusColors.Unverified
                                                    }`}
                                            >
                                                {user.jobSeekerProfile?.isVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? roleColors.Admin : roleColors.JobSeeker
                                                    }`}
                                            >
                                                {user.isAdmin ? 'Admin' : 'JobSeeker'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.location || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {Array.isArray(user.skills) ? user.skills.join(', ') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.experienceLevel || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {user.jobSeekerProfile?.isVerified ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    View Details
                                                </motion.button>
                                            ) : reminded.includes(user._id) ? (
                                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 italic flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Pending
                                                </motion.span>
                                            ) : (
                                                <motion.button
                                                    id={`verify-btn-${user._id}`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="text-yellow-600 hover:text-yellow-800 flex items-center"
                                                    onClick={() => handleVerification(user._id)}
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    Verify Now
                                                </motion.button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
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
            {totalResults > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-between mt-6 px-4 py-3 bg-white rounded-xl shadow-sm"
                >
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between w-full">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{totalResults === 0 ? 0 : startIndex + 1}</span> to{' '}
                                <span className="font-medium">{endIndex}</span> of <span className="font-medium">{totalResults}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => goToPage(clampedCurrent - 1)}
                                    disabled={clampedCurrent === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${clampedCurrent === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {pageNumbers.map((p, idx) =>
                                    p === '…' ? (
                                        <span
                                            key={`ellipsis-${idx}`}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                        >
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p)}
                                            aria-current={p === clampedCurrent ? 'page' : undefined}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${p === clampedCurrent
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => goToPage(clampedCurrent + 1)}
                                    disabled={clampedCurrent === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${clampedCurrent === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Search;
