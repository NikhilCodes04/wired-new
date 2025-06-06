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
                const userId = decodedToken.id; 
                if (!userId) {
                    throw new Error('User ID not found');
                }

                setProjects(data.projects || []);
                setMyProjects(
                    data.projects.filter(
                        (project) =>
                            project.createdBy._id === userId || // User is the creator
                            project.teamMembers.some((member) => member._id === userId)
                    )
                );
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

    // Perform text index search
    const handleTextSearch = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            console.log('Search Term:', searchTerm); // Debug log
            const response = await fetch(`${config.API_BASE_URL}/project/search?q=${searchTerm}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to perform text search');
            }
    
            const data = await response.json();
            console.log('Search Results:', data.projects); // Debug log
            setProjects(data.projects || []);
            setSearchTerm(''); // Clear the input box after search
            setLoading(false);
        } catch (err) {
            console.error('Error performing text search:', err.message); // Debug log
            setError(err.message || 'An unexpected error occurred');
            setLoading(false);
        }
    };

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

                {/* Search input with text search button */}
                <div className="flex items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search for a project"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                        onClick={handleTextSearch}
                        className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Text Search
                    </button>
                </div>

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