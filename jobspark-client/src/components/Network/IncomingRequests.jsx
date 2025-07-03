import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContextProvider";

const IncomingRequests = () => {
    const { user } = useContext(AuthContext);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("USER ID ", user?._id);


    const fetchRequests = async () => {
        if (!user?._id) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:5000/api/v1/network/connection-requests/${user._id}`);
            const data = await res.json();

            if (data.success) {
                setRequests(data.data);
            } else {
                setError("Failed to load connection requests.");
            }
        } catch (err) {
            setError("Something went wrong.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const respondToRequest = async (requestId, action) => {
        try {
            const res = await fetch(`http://localhost:5000/api/v1/network/connection-requests/${requestId}/respond`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action }),
            });

            const result = await res.json();

            if (result.success) {
                // Remove the request from list on success
                setRequests((prev) => prev.filter((r) => r._id !== requestId));
            } else {
                alert(result.message || "Failed to respond.");
            }
        } catch (err) {
            console.error("Error responding to request:", err);
            alert("Error responding to request.");
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    return (
        <div className="pt-10">
            <h2 className="text-2xl mb-4">Incoming Connection Requests</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {requests.length === 0 && !loading && <p>No pending requests.</p>}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {requests.map((req) => (
                    <div key={req._id} className="border p-4 rounded shadow bg-white">
                        <div className="flex items-center space-x-4">
                            <img
                                src={req.fromUser?.profileImage || "https://via.placeholder.com/80"}
                                alt={req.fromUser?.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-lg">{req.fromUser?.name}</h3>
                                <p className="text-gray-500">{req.fromUser?.role}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => respondToRequest(req._id, "accept")}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => respondToRequest(req._id, "reject")}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncomingRequests;
