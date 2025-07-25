import React, { useContext, useEffect, useState } from 'react';
import { FiSearch, FiClock, FiChevronDown, FiX, FiCheck, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { NetworkContext } from '../Context/NetworkContextProvider';
import { AuthContext } from '../Context/AuthContextProvider';

const IncomingRequest = () => {
    const { pendingDetials, statusChange, pending } = useContext(NetworkContext);
    const { user } = useContext(AuthContext);
    const loggedInUserId = user?._id;

    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState('Most Recent');
    const [isLoading, setIsLoading] = useState(false);

    const fetch = async () => {
        const url = `http://localhost:5000/api/v1/network/pending-information/${loggedInUserId}`;
        console.log("Fetching pending requests from", url);
        const data = await pendingDetials(url);

        if (data.success === true) {
            const withStatus = data.data.map(req => ({
                ...req,
                connectionRequestId: req.connectionRequestId || req._id,
                status: req.status || 'pending',
            }));
            setRequests(withStatus);
        } else {
            console.error("Error fetching incoming requests:", data.message);
        }
    };


    useEffect(() => {
        if (!loggedInUserId) return;
        fetch();
    }, [loggedInUserId]);

    const handleAction = async (connectionRequestId, action) => {
        setIsLoading(true);
        const url = `http://localhost:5000/api/v1/network/update-status/${connectionRequestId}`;
        const payload = { status: action };

        try {
            const result = await statusChange(url, payload);
            if (result.success) {
                setRequests(prev => prev.filter(req => req.connectionRequestId !== connectionRequestId));
                const pendingUrl = `http://localhost:5000/api/v1/network/incoming-requests/${loggedInUserId}`;
                await pending(pendingUrl); // Refresh global count/context
            } else {
                console.error("Failed to update:", result.message);
            }
        } catch (err) {
            console.error("Error updating status:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRequests = requests
        .filter(r => r.status === 'pending')
        .filter(r =>
            r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.jobSeekerProfile?.roles?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'Most Recent') return new Date(b.lastSignInTime || 0) - new Date(a.lastSignInTime || 0);
            if (sortBy === 'Name') return a.name.localeCompare(b.name);
            if (sortBy === 'Oldest') return new Date(a.lastSignInTime || 0) - new Date(b.lastSignInTime || 0);
            return 0;
        });

    const sortOptions = ['Most Recent', 'Name', 'Oldest'];

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
    };

    return (
        <div className="h-auto bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.header
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Incoming Requests</h1>
                    <p className="text-gray-600">Manage your connection requests and networking opportunities</p>

                    <div className="mt-6 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or role..."
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all duration-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <FiX className="text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </motion.header>

                <div className="flex justify-between items-center mb-6">
                    <div className="text-sm font-medium text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {filteredRequests.length}
                        </span>
                        <span className="ml-2">pending request{filteredRequests.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setSortOpen(!sortOpen)}
                            className="inline-flex items-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Sort by: {sortBy}
                            <FiChevronDown className={`ml-2 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {sortOpen && (
                                <motion.div
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                >
                                    <div className="py-1">
                                        {sortOptions.map(option => (
                                            <button
                                                key={option}
                                                className={`block px-4 py-2 text-sm w-full text-left ${sortBy === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => {
                                                    setSortBy(option);
                                                    setSortOpen(false);
                                                }}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(request => (
                                <motion.div
                                    key={request._id}
                                    className="bg-white overflow-hidden shadow rounded-xl"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                >
                                    <div className="px-5 py-6 sm:p-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 bg-blue-500 rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl">
                                                {request.name?.charAt(0)}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{request.name}</h3>
                                                        <p className="text-sm text-gray-500">{request.jobSeekerProfile?.roles}</p>
                                                    </div>
                                                    <span className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                                                        <FiClock className="mr-1" size={12} />
                                                        {request.lastSignInTime ? new Date(request.lastSignInTime).toLocaleDateString() : 'Never'}
                                                    </span>
                                                </div>

                                                <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                    <p className="italic">"{request.jobSeekerProfile?.bio || 'No message provided.'}"</p>
                                                </div>

                                                <div className="mt-5 flex space-x-3">
                                                    <button
                                                        onClick={() => handleAction(request.connectionRequestId, "accepted")}
                                                        disabled={isLoading}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        {isLoading ? (
                                                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                                                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                                                            </svg>
                                                        ) : (
                                                            <FiCheck className="mr-2" />
                                                        )}
                                                        Accept
                                                    </button>

                                                    <button
                                                        onClick={() => handleAction(request.connectionRequestId, "rejected")}
                                                        disabled={isLoading}
                                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        <FiX className="mr-2" />
                                                        Reject
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                className="text-center py-12 bg-white rounded-xl shadow"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <FiUser className="text-gray-400" size={24} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">No pending requests</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {searchTerm ?
                                        "No requests match your search. Try different keywords." :
                                        "When you receive new connection requests, they'll appear here."}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default IncomingRequest;
