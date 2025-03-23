import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";

const FindMentors = () => {
    const [techStack, setTechStack] = useState(""); // Input for tech stack
    const [mentors, setMentors] = useState([]); // List of mentors
    const [allMentors, setAllMentors] = useState([]); // Full list of mentors
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch all mentors on component load
    useEffect(() => {
        const fetchAllMentors = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                const response = await axios.get(`${config.API_BASE_URL}/user/mentors`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAllMentors(response.data.mentors || []);
                setMentors(response.data.mentors || []); // Initially display all mentors
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while fetching mentors.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllMentors();
    }, []);

    // Handle search for mentors by tech stack
    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            if (techStack.trim()) {
                // Call searchMentorsByTechStack if techStack is provided
                const payload = { techStack: techStack.split(",").map((tech) => tech.trim()) };
                const response = await axios.post(
                    `${config.API_BASE_URL}/user/mentors/search`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setMentors(response.data.mentors || []); // Update the list with filtered mentors
            } else {
                // If no techStack is provided, reset to all mentors
                setMentors(allMentors);
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while searching for mentors.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Mentors</h2>

                {/* Input for Tech Stack */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Technologies (comma-separated):
                    </label>
                    <input
                        type="text"
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        placeholder="e.g., React, Node.js, MongoDB"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className={`w-full py-2 px-4 text-white rounded-lg ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                    } transition-colors`}
                >
                    {loading ? "Searching..." : "Search"}
                </button>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                {/* Results */}
                <div className="mt-6">
                    {mentors.length > 0 ? (
                        <ul className="space-y-4">
                            {mentors.map((mentor) => (
                                <li
                                    key={mentor._id}
                                    className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">{mentor.name}</h3>
                                    <p className="text-gray-600">
                                        <strong>Email:</strong> {mentor.email}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Phone:</strong> {mentor.phoneNumber || "N/A"}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Technological Stack:</strong> {mentor.technologicalStack.join(", ")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p className="text-gray-600">No mentors found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindMentors;