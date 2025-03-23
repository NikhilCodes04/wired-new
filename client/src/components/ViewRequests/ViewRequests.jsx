import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config.js";
const ViewRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token"); // Get token for authorization

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/request/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRequests(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching requests:", err);
                setError("Failed to load requests.");
                setLoading(false);
            }
        };

        fetchRequests();
    }, [token]);

    const handleRequestAction = async (requestId, status) => {
        try {
            const response = await axios.patch(
                `${config.API_BASE_URL}/requests/${requestId}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);

            // Update UI after response
            setRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === requestId ? { ...req, status } : req
                )
            );
        } catch (err) {
            console.error("Error updating request status:", err);
            alert("Failed to update request status.");
        }
    };

    if (loading) return <p className="text-gray-600">Loading requests...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Your Requests</h2>
                {requests.length === 0 ? (
                    <p className="text-gray-600">No requests to display.</p>
                ) : (
                    <ul className="space-y-4">
                        {requests.map((request) => (
                            <li
                                key={request._id}
                                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50"
                            >
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {request.type === "mentor"
                                        ? "Mentorship Request"
                                        : "Teammate Request"}
                                </h3>
                                <p className="text-gray-600">
                                    <strong>Sender:</strong> {request.senderId}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Project:</strong> {request.projectId}
                                </p>
                                <p className="text-gray-600">
                                    <strong>Status:</strong> {request.status}
                                </p>
                                {request.status === "pending" && (
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                            onClick={() =>
                                                handleRequestAction(request._id, "accepted")
                                            }
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                            onClick={() =>
                                                handleRequestAction(request._id, "rejected")
                                            }
                                        >
                                            Decline
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ViewRequests;