import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './../Context/AuthContextProvider';
import { NetworkContext } from '../Context/NetworkContextProvider';
import IncomingRequest from './IncomingRequest';

const NetworkLayout = () => {
    const { user } = useContext(AuthContext);
    const { pendingDetials, fetchAcceptedInfo, fetchRec, sendConnection, pending } = useContext(NetworkContext);

    const loggedInUserId = user?._id;
    const fromUserId = user?._id;

    const [recommendation, setRecommendation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [acceptedConnections, setAcceptedConnections] = useState([]);
    const [pendingData, setPendingData] = useState([]);
    const [info, setInfo] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [sendConn, setSendConn] = useState(new Set());

    // Pagination states
    const USERS_PER_PAGE = 7;
    const [currentPage, setCurrentPage] = useState(1);

    const handleFetchRecom = async () => {
        const url = `http://localhost:5000/api/v1/all-user/${loggedInUserId}`;
        const response = await fetchRec(url);
        setRecommendation(response);
    };

    const getAcceptedInfo = async () => {
        const url = `http://localhost:5000/api/v1/network/accepted-users/${loggedInUserId}`;
        const res = await fetchAcceptedInfo(url);
        if (res.success) {
            setInfo(res);
        }
    };

    const fetchingPendingUser = async () => {
        const url = `http://localhost:5000/api/v1/network/get-pendingId/${fromUserId}`;
        const response = await pending(url);
        if (response.success) {
            setPendingData(response.ids);
        }
    };

    const handleConnect = async (toUserId) => {
        const url = `http://localhost:5000/api/v1/network/send-connection-request`;
        const ids = { fromUserId, toUserId };
        const req = await sendConnection(url, ids);
        if (req.success) {
            alert("Sent request");
            setSendConn(prev => new Set(prev).add(toUserId));
            await fetchingPendingUser();
        } else {
            alert(`Error: ${req.message}`);
        }
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(prev => (prev === id ? null : id));
    };

    useEffect(() => {
        if (!loggedInUserId) return;
        handleFetchRecom();
        getAcceptedInfo();
        fetchingPendingUser();
    }, [loggedInUserId]);

    const paginatedUsers = recommendation?.data?.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const totalPages = Math.ceil((recommendation?.data?.length || 0) / USERS_PER_PAGE);

    return (
        <>
            <div>
                <IncomingRequest />
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">People you may know</h2>
                        <span className="text-gray-500">
                            Recommendations for you ({recommendation?.count || 0})
                        </span>
                    </div>
                    <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={handleFetchRecom}
                    >
                        See all
                    </button>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {paginatedUsers?.map((rec) => (
                        <div key={rec._id} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 relative group">
                            {/* Dropdown */}
                            <div className="flex justify-end px-4 pt-4">
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown(rec._id)}
                                        className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 16 3">
                                            <path d="M2 0a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 2 0Zm6.041 0a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 8.041 0ZM14 0a1.5 1.5 0 1 1 0 3A1.5 1.5 0 0 1 14 0Z" />
                                        </svg>
                                    </button>
                                    {activeDropdown === rec._id && (
                                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                            <button
                                                onClick={() => setActiveDropdown(null)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Ignore
                                            </button>
                                            <button
                                                onClick={() => setActiveDropdown(null)}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Report profile
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="flex flex-col items-center pb-8 px-4">
                                <div className="relative mb-4">
                                    <img
                                        className="h-24 w-24 rounded-full shadow-lg object-cover border-2 border-white"
                                        src={
                                            rec.profileImage ||
                                            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                                        }
                                        alt={rec.name}
                                    />
                                    {rec.isActive && (
                                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                                    )}
                                </div>

                                <h5 className="mb-1 mt-3 text-lg font-semibold text-gray-900">{rec.name}</h5>
                                <span className="text-sm text-gray-500 mb-2">
                                    {rec?.role === "job_seeker" ? "Job Seeker" : rec?.role === "employer" ? "Employer" : "N/A"}
                                </span>

                                {/* Status */}
                                <div className="flex space-x-3 mt-4 w-full">
                                    {rec.connectionStatus === "rejected" ? (
                                        <button className="flex-1 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg border border-red-600 cursor-not-allowed" disabled>
                                            Rejected
                                        </button>
                                    ) : info?.data?.some(user => user._id === rec._id) ? (
                                        <button className="flex-1 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg border border-green-600 cursor-not-allowed" disabled>
                                            Accepted
                                        </button>
                                    ) : pendingData.includes(rec._id) ? (
                                        <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg bg-blue-50 cursor-not-allowed" disabled>
                                            Pending...
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                                onClick={() => handleConnect(rec._id)}
                                            >
                                                Connect
                                            </button>
                                            <button
                                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                                onClick={() => alert(`Messaging ${rec.name} is coming soon!`)}
                                            >
                                                Message
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Buttons */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`btn join-item px-4 py-2 rounded-md border ${currentPage === index + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default NetworkLayout;
