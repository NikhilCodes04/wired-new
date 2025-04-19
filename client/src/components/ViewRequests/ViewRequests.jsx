import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config.js";
import { jwtDecode } from "jwt-decode"; // You'll need to install this package

const ViewRequests = () => {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("incoming"); // To toggle between tabs
    const token = localStorage.getItem("token");
    
    let userId;
    try {
        // Extract user ID from token - adjust as needed based on your token structure
        const decoded = jwtDecode(token);
        // eslint-disable-next-line no-unused-vars
        userId = decoded.id || decoded.userId || decoded._id;
    } catch (err) {
        console.error("Error decoding token:", err);
    }

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${config.API_BASE_URL}/request/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const { incomingRequests, outgoingRequests } = response.data;
                console.log("Fetched incoming requests:", incomingRequests);
                console.log("Fetched outgoing requests:", outgoingRequests);

                setIncomingRequests(incomingRequests);
                setOutgoingRequests(outgoingRequests);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching requests:", err);
                setError(err.response?.data?.message || "Failed to load requests.");
                setLoading(false);
            }
        };

        fetchRequests();
    }, [token]);

    const handleRequestAction = async (requestId, status) => {
        try {
            const endpoint = status === 'canceled' 
                ? `${config.API_BASE_URL}/request/cancel/${requestId}` 
                : `${config.API_BASE_URL}/request/${requestId}/status`;
    
            const response = await axios.patch(
                endpoint,
                status !== 'canceled' ? { status } : {}, // Only send body for non-cancel actions
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            alert(response.data.message);
    
            // Update UI after response
            if (status === 'canceled') {
                setOutgoingRequests((prevRequests) =>
                    prevRequests.filter((req) => req._id !== requestId)
                );
            } else {
                setIncomingRequests((prevRequests) =>
                    prevRequests.map((req) =>
                        req._id === requestId ? { ...req, status } : req
                    )
                );
                setOutgoingRequests((prevRequests) =>
                    prevRequests.map((req) =>
                        req._id === requestId ? { ...req, status } : req
                    )
                );
            }
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
                
                {/* Tab selector */}
                <div className="flex border-b mb-6">
                    <button 
                        className={`py-2 px-4 mr-2 ${activeTab === 'incoming' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('incoming')}
                    >
                        Incoming Requests ({incomingRequests.length})
                    </button>
                    <button 
                        className={`py-2 px-4 mr-2 ${activeTab === 'outgoing' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('outgoing')}
                    >
                        Outgoing Requests ({outgoingRequests.length})
                    </button>
                </div>
                
                {/* Display active tab content */}
                {activeTab === 'incoming' && (
                    incomingRequests.length === 0 ? (
                        <p className="text-gray-600">No incoming requests found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {incomingRequests.map((request) => (
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
                                        <strong>From:</strong> {request.senderId.name} ({request.senderId.email})
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Project:</strong> {request.projectId.name}
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
                    )
                )}
                
                {activeTab === 'outgoing' && (
                    outgoingRequests.length === 0 ? (
                        <p className="text-gray-600">No outgoing requests found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {outgoingRequests.map((request) => (
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
                                        <strong>To:</strong> {request.receiverId.name} ({request.receiverId.email})
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Project:</strong> {request.projectId.name}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Status:</strong> {request.status}
                                    </p>
                                    {request.status === "pending" && (
                                        <div className="flex space-x-4 mt-4">
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                onClick={() =>
                                                    handleRequestAction(request._id, "canceled")
                                                }
                                            >
                                                Cancel Request
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </div>
    );
};

export default ViewRequests;