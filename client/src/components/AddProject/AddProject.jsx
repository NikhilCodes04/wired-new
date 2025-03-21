import { useState } from 'react';
import { useNavigate } from 'react-router';
import config from '../../config/config.js';
const AddProject = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate empty fields
        if (!name.trim()) {
            setError('Project name is required');
            return;
        }
        if (!description.trim()) {
            setError('Project description is required');
            return;
        }
        if (!technologies.trim()) {
            setError('Technologies are required');
            return;
        }

        // Validate maximum technologies limit (e.g., 10 technologies)
        const techArray = technologies.split(',').map((tech) => tech.trim());
        if (techArray.length > 10) {
            setError('You can only add up to 10 technologies');
            return;
        }

        // Validate unauthorized submission (e.g., missing token)
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized: Please log in to create a project');
            return;
        }

        setLoading(true);
        setError('');

        const projectData = {
            name,
            description,
            technologies: techArray,
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/project/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add JWT token in the headers
                },
                body: JSON.stringify(projectData),
            });

            if (!response.ok) {
                // Handle server-side errors
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create project');
            }

            const data = await response.json();
            alert(data.message);
            navigate('/dashboard/view-projects'); // Redirect to the list of projects
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-5 flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">Project Name:</label>
                        <input
                            id="projectName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter project name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
                        <textarea
                            id="projectDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter project description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="projectTechnologies" className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma separated):</label>
                        <input
                            id="projectTechnologies"
                            type="text"
                            value={technologies}
                            onChange={(e) => setTechnologies(e.target.value)}
                            placeholder="Enter technologies"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>

                    {error && <div id="inputError" className="text-red-500 text-sm">{error}</div>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 px-4 text-white rounded-lg ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                            } transition-colors`}
                        >
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProject;