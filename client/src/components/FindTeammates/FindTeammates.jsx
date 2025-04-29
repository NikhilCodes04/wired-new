import { useState, useEffect } from "react";
import { useParams } from "react-router"; // Import useParams
import axios from "axios";
import config from "../../config/config";

const FindTeammates = () => {
    const { id:projectId } = useParams(); // Extract projectId from the URL
    const [techStack, setTechStack] = useState(""); // Input for tech stack
    const [students, setStudents] = useState([]); // List of students
    const [allStudents, setAllStudents] = useState([]); // Full list of students
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state


    console.log("Project ID:", projectId); // Log the projectId for debugging
    // Fetch all students on component load
    useEffect(() => {
        const fetchAllStudents = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                const response = await axios.get(`${config.API_BASE_URL}/user/students`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAllStudents(response.data.students || []);
                setStudents(response.data.students || []); // Initially display all students
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while fetching students.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllStudents();
    }, []);

    // Handle search for students by tech stack
    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            if (techStack.trim()) {
                // Call searchStudentsByTechStack if techStack is provided
                const payload = { techStack: techStack.split(",").map((tech) => tech.trim()) };
                const response = await axios.post(
                    `${config.API_BASE_URL}/user/students/search`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setStudents(response.data.students || []); // Update the list with filtered students
            } else {
                // If no techStack is provided, reset to all students
                setStudents(allStudents);
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while searching for teammates.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (studentId) => {
        setLoading(true);
        setError(null);
    
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in.");
            }
    
            await axios.post(
                `${config.API_BASE_URL}/request/send`,
                {
                    receiverId: studentId, // Ensure this is passed correctly
                    projectId,             // Include projectId
                    type: "teammate_request", // Add the type of request
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            alert("Request sent successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while sending the request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Teammates</h2>
    
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
                    {students.length > 0 ? (
                        <ul className="space-y-4">
                            {students.map((student) => (
                                <li
                                    key={student._id}
                                    className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-50"
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                                    <p className="text-gray-600">
                                        <strong>Email:</strong> {student.email}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Phone:</strong> {student.phoneNumber || "N/A"}
                                    </p>
                                    <p className="text-gray-600">
                                        <strong>Technological Stack:</strong> {student.technologicalStack.join(", ")}
                                    </p>
                                    {/* Send Request Button */}
                                    <button
                                        onClick={() => handleSendRequest(student._id)}
                                        className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Send Request
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !loading && <p className="text-gray-600">No students found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindTeammates;