import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../config/config";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const AdminPage = () => {
    const [loading, setLoading] = useState(true);
    const [adminData, setAdminData] = useState({
        totalProjects: 0,
        totalStudents: 0,
        totalMentors: 0,
        recentProject: null,
        topStudents: [],
        projectsByTech: [],
        projectsByStatus: [],
        growthData: { usersGrowth: [], projectsGrowth: [], requestsGrowth: [] },
    });

    // Fetch admin data
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [
                    projectsRes,
                    studentsRes,
                    mentorsRes,
                    recentProjectRes,
                    topStudentsRes,
                    techRes,
                    statusRes,
                    growthRes,
                ] = await Promise.all([
                    axios.get(`${config.API_BASE_URL}/admin/total-projects`),
                    axios.get(`${config.API_BASE_URL}/admin/total-students`),
                    axios.get(`${config.API_BASE_URL}/admin/total-mentors`),
                    axios.get(`${config.API_BASE_URL}/admin/recent-project`),
                    axios.get(`${config.API_BASE_URL}/admin/top-students`),
                    axios.get(`${config.API_BASE_URL}/admin/projects-by-tech`),
                    axios.get(`${config.API_BASE_URL}/admin/projects-by-status`),
                    axios.get(`${config.API_BASE_URL}/admin/database-growth`),
                ]);

                setAdminData({
                    totalProjects: projectsRes.data.totalProjects,
                    totalStudents: studentsRes.data.totalStudents,
                    totalMentors: mentorsRes.data.totalMentors,
                    recentProject: recentProjectRes.data.recentProject,
                    topStudents: topStudentsRes.data.students,
                    projectsByTech: techRes.data.projectsByTech,
                    projectsByStatus: statusRes.data.projectsByStatus,
                    growthData: growthRes.data,
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                alert("Failed to load admin data. Please try again later.");
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []); 

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const {
        totalProjects,
        totalStudents,
        totalMentors,
        recentProject,
        topStudents,
        projectsByTech,
        projectsByStatus,
        growthData,
    } = adminData;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <SummaryCard title="Total Projects" value={totalProjects} color="blue" />
                    <SummaryCard title="Total Students" value={totalStudents} color="green" />
                    <SummaryCard title="Total Mentors" value={totalMentors} color="yellow" />
                    <SummaryCard
                        title="Recent Project"
                        value={recentProject ? recentProject.name || "Unnamed Project" : "No recent project"}
                        color="purple"
                    />
                </div>

                {/* Top Students */}
                <Section title="Top Students by Projects">
                    <ul>
                        {topStudents.map((student) => (
                            <li key={student._id} className="mb-2">
                                {student.name} ({student.email}) - {student.projectCount} projects
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* Projects by Technology */}
                <Section title="Most Technology Used in Projects">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projectsByTech.map((tech) => (
                            <div
                                key={tech._id}
                                className="bg-blue-100 p-4 rounded-lg shadow-md flex justify-between items-center"
                            >
                                <span className="text-blue-800 font-semibold">{tech._id}</span>
                                <span className="text-blue-600 font-bold">{tech.count}</span>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Projects by Status */}
                <Section title="Projects by Status">
                    <ul>
                        {projectsByStatus.map((status) => (
                            <li key={status._id}>
                                {status._id}: {status.count}
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* Growth Chart */}
                <Section title="Growth Over Time">
                    <LineChart width={600} height={300} data={growthData.studentsGrowth}>
                        
                        <Line type="monotone" dataKey="count" data={growthData.projectsGrowth} stroke="#ffc658" name="Projects" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                    </LineChart>
                </Section>
            </div>
        </div>
    );
};

// Summary Card Component
const SummaryCard = ({ title, value, color }) => (
    <div className={`bg-${color}-100 p-4 rounded-lg shadow`}>
        <h2 className={`text-xl font-bold text-${color}-800`}>{title}</h2>
        <p className={`text-${color}-600 text-lg`}>{value}</p>
    </div>
);

// Section Component
const Section = ({ title, children }) => (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
    </div>
);

export default AdminPage;