import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";

const AdminPage = () => {
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalMentors, setTotalMentors] = useState(0);
    const [recentProject, setRecentProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch admin data
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Ensure all requests use the base URL
                const [projectsRes, studentsRes, mentorsRes, recentProjectRes] = await Promise.all([
                    axios.get(`${config.API_BASE_URL}/admin/total-projects`, { headers }),
                    axios.get(`${config.API_BASE_URL}/admin/total-students`, { headers }),
                    axios.get(`${config.API_BASE_URL}/admin/total-mentors`, { headers }),
                    axios.get(`${config.API_BASE_URL}/admin/recent-project`, { headers }),
                ]);

                setTotalProjects(projectsRes.data.totalProjects);
                setTotalStudents(studentsRes.data.totalStudents);
                setTotalMentors(mentorsRes.data.totalMentors);
                setRecentProject(recentProjectRes.data.recentProject);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    // Handle delete old requests
    const handleDeleteOldRequests = async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.post(
                `${config.API_BASE_URL}/admin/delete-old-requests`,
                {
                    status: ["pending", "cancelled", "accepted"], // Example statuses
                    olderThanDate: "2025-01-01", // Example date
                },
                { headers }
            );

            alert(response.data.message || "Old requests deleted successfully!");
        } catch (err) {
            alert("Error deleting old requests.");
            console.error(err);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Section</h1>
                <p className="text-gray-600 text-lg mb-6">Here you can manage users, projects, and more.</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-100 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-blue-800">Total Projects</h2>
                        <p className="text-blue-600 text-lg">{totalProjects}</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-green-800">Total Students</h2>
                        <p className="text-green-600 text-lg">{totalStudents}</p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-yellow-800">Total Mentors</h2>
                        <p className="text-yellow-600 text-lg">{totalMentors}</p>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-bold text-purple-800">Recent Project</h2>
                        <p className="text-purple-600 text-lg">
                            {recentProject ? recentProject.name || "Unnamed Project" : "No recent project"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleDeleteOldRequests}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Delete Old Requests
                </button>
            </div>
        </div>
    );
};

export default AdminPage;