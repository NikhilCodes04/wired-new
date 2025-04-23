import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import config from '../../config/config';
import { jwtDecode } from "jwt-decode";

export const ViewProjects = () => {
    const [projects, setProjects] = useState([]);
    const [myProjects, setMyProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // Tab state: 'all' or 'my'

    const navigate = useNavigate();
    const decodedToken = jwtDecode(localStorage.getItem('token'));
    //console.log(decodedToken.id);


    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found in local storage');
                }

                const response = await fetch(`${config.API_BASE_URL}/project`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                //console.log(data);
                const userId = decodedToken.id; // Get userId from the response or local storage
                if (!userId) {
                    throw new Error('User ID not found');
                }
                setProjects(data.projects || []);
                setMyProjects(data.projects.filter((project) => project.createdBy._id === userId)); // Adjusted filtering logic // Filter user's projects
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An unexpected error occurred');
                setLoading(false);
            }
        };

        fetchProjects();
    }, [decodedToken.id]);

    // Filter projects based on the search term
    const filteredProjects =
        activeTab === 'all'
            ? projects.filter((project) =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : myProjects.filter((project) =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Find Projects</h2>

                {/* Tab Selector */}
                <div className="flex border-b mb-6">
                    <button
                        className={`py-2 px-4 mr-2 ${activeTab === 'all'
                            ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                            : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Projects
                    </button>
                    <button
                        className={`py-2 px-4 ${activeTab === 'my'
                            ? 'border-b-2 border-blue-500 font-medium text-blue-600'
                            : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab('my')}
                    >
                        My Projects
                    </button>
                </div>

                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search for a project"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

                {/* Loading/Error State */}
                {loading && <p className="text-gray-600">Loading projects...</p>}
                {error && <p className="text-red-500">Error: {error}</p>}

                {/* Project List */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <li
                            key={project._id}
                            onClick={() => navigate(`/dashboard/view-projects/${project._id}`)} // Navigate to ProjectPage
                            className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h3>
                            <p className="text-gray-600">{project.description.slice(0, 100)}...</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ViewProjects;