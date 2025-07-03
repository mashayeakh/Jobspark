import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './../Context/AuthContextProvider';
import IncomingRequests from './IncomingRequests';

const NetworkLayout = () => {
    const { user } = useContext(AuthContext); // Assuming you store logged-in user here
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    // Call fetchRecommendations on mount
    useEffect(() => {
        fetchRecommendations();
    }, [user]);

    return (
        <>
            <div>
                <h2 className="mb-5 text-3xl">People you may know</h2>

                {loading && <p>Loading recommendations...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {!loading && !error && recommendations.length === 0 && (
                    <p>No recommendations found at the moment.</p>
                )}

                <div className="w-full pt-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {!loading &&
                            !error &&
                            recommendations.map((rec) => (
                                <div
                                    key={rec._id}
                                    className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm"
                                >
                                    <div className="flex justify-end px-4 pt-4">
                                        {/* Dropdown Button */}
                                        {/* You'll need to implement actual dropdown logic using state or a library */}
                                        <button
                                            id={`dropdownButton-${rec._id}`} // Unique ID for each dropdown
                                            data-dropdown-toggle={`dropdown-${rec._id}`}
                                            className="inline-block rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                                            type="button"
                                        // onClick={() => toggleDropdown(rec._id)} // Example: if you manage dropdowns with React state
                                        >
                                            <span className="sr-only">Open dropdown</span>
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

                                        {/* Dropdown Content */}
                                        {/* For a true dropdown, you'd likely manage visibility with state */}
                                        <div
                                            id={`dropdown-${rec._id}`} // Unique ID for each dropdown
                                            className="z-10 hidden w-fit list-none divide-y divide-gray-100 rounded-lg bg-white shadow-sm dark:bg-gray-700 text-base"
                                        // style={{ display: activeDropdown === rec._id ? 'block' : 'none' }} // Example: If managing visibility
                                        >
                                            <ul className="py-2" aria-labelledby={`dropdownButton-${rec._id}`}>
                                                <li>
                                                    <a
                                                        href="#"
                                                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            console.log('Ignore clicked for:', rec.name);
                                                            // Add logic to remove this recommendation or send to API
                                                        }}
                                                    >
                                                        Ignore
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Profile Information */}
                                    <div className="flex flex-col items-center pb-10">
                                        <img
                                            className="mb-3 h-24 w-24 rounded-full shadow-lg object-cover"
                                            src={
                                                rec.profileImage ||
                                                'https://via.placeholder.com/150'
                                            } // Fallback image
                                            alt={rec.name}
                                        />
                                        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                            {rec.name}
                                        </h5>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {rec.role}
                                        </span>
                                        <div className="mt-4 flex md:mt-6">
                                            <button
                                                className="btn btn-primary border px-10 py-2 text-2xl"
                                                onClick={() => console.log('Connect clicked for:', rec.name)}
                                            >
                                                Connect
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <IncomingRequests />
            </div>
        </>
    )
}

export default NetworkLayout