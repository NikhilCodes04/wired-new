import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import config from '../../config/config';
const ProjectPage = () => {
    const { id } = useParams(); // Get the project ID from the route parameter
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found in local storage');
                }

                const response = await fetch(`${config.API_BASE_URL}/project/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch project details');
                }

                const data = await response.json();
                setProject(data.project);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'An unexpected error occurred');
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    if (loading) {
        return <p className="text-gray-600">Loading project details...</p>;
    }

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {project && (
                <div className="bg-white shadow-md rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{project.name}</h2>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    {/* Project Leader */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Project Leader:</h3>
                    <p className="text-gray-600 mb-4">{project.createdBy.name}</p>

                    {/* Technologies */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Technologies:</h3>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                        {project.technologies.map((tech, index) => (
                            <li key={index}>{tech}</li>
                        ))}
                    </ul>

                    {/* Team Members */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Members:</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {project.teamMembers.map((member) => (
                            <li key={member._id}>{member.name}</li>
                        ))}
                    </ul>
                    
                    <div className='flex '>
                <button className='p-2 bg-indigo-600 m-1 text-white rounded-md'>Find Teammates</button>
                    <button className='p-2 bg-indigo-600 m-1 text-white rounded-md'>Find Mentors</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPage;