import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './../Context/AuthContextProvider';
import { NetworkContext } from '../Context/NetworkContextProvider';
import IncomingRequest from './IncomingRequest';

const NetworkLayout = () => {
    const { user } = useContext(AuthContext); // Assuming you store logged-in user here
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [acceptedConnections, setAcceptedConnections] = useState([]);

    const { pendingDetials, fetchAcceptedInfo } = useContext(NetworkContext);

    const loggedInUserId = user?._id;
    // const [pendingDetails, setPendingDetails] = useState([]);

    // const fetch = async () => {
    //     const url = `http://localhost:5000/api/v1/network/pending-information/${loggedInUserId}`;
    //     const data = await pendingDetials(url);
    //     if (data.success === true) {
    //         setPendingDetails(data.data);
    //         console.log("Pending data from fetch", data);
    //     } else {
    //         console.error("Error fetching pending details:", data.message);
    //     }
    // }



    // Function to fetch recommendations
    const fetchRecommendations = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/api/v1/network/recommend-connections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user), // Send user profile as request body
            });

            const data = await response.json();

            if (data.success) {
                setRecommendations(data.data);
            } else {
                setError('Failed to load recommendations');
            }
        } catch (err) {
            setError('Error fetching recommendations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const [info, setInfo] = useState([]);
    const getAcceptedInfo = async () => {
        const url = `http://localhost:5000/api/v1/network/accepted-users/${loggedInUserId}`;
        const res = await fetchAcceptedInfo(url);
        if (res.success === true) {
            setInfo(res);
            console.log("FETCH ", res);
        } else {
            console.error("Error fetching accepted users:", res.message);
        }
    }


    // Call fetchRecommendations on mount
    useEffect(() => {

        if (!loggedInUserId) return;
        fetchRecommendations();
        getAcceptedInfo()
        // fetch();

    }, [user]);



    const { fetchRec, sendConnection, pending } = useContext(NetworkContext);
    const [recommendation, setRecommendation] = useState([]);

    const handleFetchRecom = async () => {
        const url = `http://localhost:5000/api/v1/network/recommendations/ai-users/${loggedInUserId}`
        // const url = `http://localhost:5000/api/v1/network/accepted-connections/${loggedInUserId}`;

        console.log("Hitting into = ", url);
        const response = await fetchRec(url);
        setRecommendation(response);
    }

    useEffect(() => {
        if (!loggedInUserId) return;
        handleFetchRecom();
    }, [loggedInUserId])

    console.log("VALUE", recommendation);

    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (id) => {
        setActiveDropdown((prev) => (prev === id ? null : id));
    };

    const fromUserId = user?._id;
    const [sendConn, setSendConn] = useState(new Set());

    const handleConnect = async (toUserId) => {
        const url = `http://localhost:5000/api/v1/network/send-connection-request`;
        const ids = {
            fromUserId,
            toUserId,
        }
        const req = await sendConnection(url, ids);
        if (req.success === true) {
            console.log("Request from handleConnect", req);
            alert("Sent request");
            setSendConn(prev => new Set(prev).add(toUserId));
        } else {
            alert(`Error: ${req.message}`);
        }
    }

    //pending user
    const [pendingData, setPendingData] = useState([]);
    const fetchingPendingUser = async () => {
        const url = `http://localhost:5000/api/v1/network/get-pendingId/${fromUserId}`;
        console.log("Hitting to pending url", url);

        const response = await pending(url);
        if (response.success === true) {
            setPendingData(response.ids);
            console.log("Pending data ", pendingData);
        }
    }



    useEffect(() => {
        if (!fromUserId) return;
        fetchingPendingUser();
    }, [fromUserId])


    console.log("Pending data ", pendingData);

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
                            Recommendations for you ({recommendation?.data?.length || 0})
                        </span>
                    </div>
                    <button
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={handleFetchRecom}
                        aria-label="See all recommendations"
                    >
                        See all
                    </button>
                </div>

                {/* Status Messages */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        <span className="ml-3 text-blue-600 font-medium">Loading recommendations...</span>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">Error loading recommendations: {error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !error && (recommendation?.data?.length === 0 || !recommendation?.data) && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No recommendations found</h3>
                        <p className="mt-1 text-gray-500">We couldn't find any recommendations for you right now.</p>
                        <div className="mt-6">
                            <button
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleFetchRecom}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                )}

                {/* Recommendation Cards */}
                <div className="w-full pt-5">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {!loading && !error && recommendation?.data?.map((rec) => (
                            <div
                                key={rec._id}
                                className="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 relative group"
                            >
                                {/* Dropdown */}
                                <div className="flex justify-end px-4 pt-4">
                                    <div className="relative">
                                        <button
                                            id={`dropdownButton-${rec._id}`}
                                            className="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none"
                                            type="button"
                                            onClick={() => toggleDropdown(rec._id)}
                                            aria-label="Open options"
                                        >
                                            <svg
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 16 3"
                                            >
                                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                            </svg>
                                        </button>

                                        {activeDropdown === rec._id && (
                                            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                                <button
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => {
                                                        // Optionally implement hide logic
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    Ignore
                                                </button>
                                                <button
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => {
                                                        // Optionally implement report logic
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    Report profile
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="flex flex-col items-center pb-8 px-4">
                                    <div className="relative mb-4">
                                        <img
                                            className="h-24 w-24 rounded-full shadow-lg object-cover border-2 border-white"
                                            src={rec.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                                            alt={rec.name}
                                        />
                                        {rec.isActive && (
                                            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
                                        )}
                                    </div>

                                    <h5 className="mb-1 text-lg font-semibold text-gray-900">
                                        {rec.name}
                                    </h5>

                                    <span className="text-sm text-gray-500 mb-2">
                                        {rec?.role === "job_seeker"
                                            ? "Job Seeker"
                                            : rec?.role === "employer"
                                                ? "Employer"
                                                : "N/A"}
                                    </span>

                                    {rec.mutualConnections > 0 && (
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 0 1 6 0zM17 6a3 3 0 11-6 0 3 3 0 0 1 6 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 0 0-1.5-4.33A5 5 0 0 1 19 16v1h-6.07zM6 11a5 5 0 0 1 5 5v1H1v-1a5 5 0 0 1 5-5z" />
                                            </svg>
                                            {rec.mutualConnections} mutual connection{rec.mutualConnections !== 1 ? 's' : ''}
                                        </div>
                                    )}

                                    <div className="flex space-x-3 mt-4 w-full">
                                        {info?.data.some(user => user._id === rec._id) ? (
                                            <button
                                                className="flex-1 px-4 py-2 bg-green-100 text-green-700 font-medium rounded-lg border border-green-600 cursor-not-allowed"
                                                disabled
                                            >
                                                Accepted
                                            </button>
                                        ) : pendingData.includes(rec._id) ? (
                                            <button
                                                className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg bg-blue-50 cursor-not-allowed"
                                                disabled
                                            >
                                                Pending...
                                            </button>
                                        ) : (
                                            <button
                                                className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                                onClick={() => handleConnect(rec._id)}
                                            >
                                                Connect
                                            </button>
                                        )}

                                        <button
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                            onClick={() => alert(`Messaging ${rec.name} is coming soon!`)}
                                        >
                                            Message
                                        </button>
                                    </div>

                                </div>
                                {/* Tooltip on hover */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                                        {rec.email}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}

export default NetworkLayout