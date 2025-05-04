import { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router';
import config from '../../config/config';

const ProjectPage = () => {
    const { id } = useParams(); // Get the project ID from the route parameter
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false); // State to check if the user is the project owner
    const [userRole, setUserRole] = useState(''); // State to store the role of the logged-in user

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

                // Decode the JWT to get the user ID and role
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const userId = decodedToken.id;
                const role = decodedToken.role; // Assuming the role is stored in the token
                setUserRole(role);

                // Check if the logged-in user is the project owner
                setIsOwner(data.project.createdBy._id === userId);

                setLoading(false);
            } catch (err) {
                setError(err.message || 'An unexpected error occurred');
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [id]);

    const handleJoinProject = async (joinAs) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found in local storage');
            }

            const payload = {
                projectId: id, // The project ID
                type: joinAs === 'teammate' ? 'teammate_request' : 'mentor_request', // Request type
                receiverId: project.createdBy._id, // The project owner is the receiver
            };

            console.log('Sending Request Payload:', payload);

            const response = await fetch(`${config.API_BASE_URL}/request/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend Error:', errorData);
                throw new Error(errorData.message || 'Failed to send join request');
            }

            const data = await response.json();
            alert(data.message || `Successfully sent a request to join as a ${joinAs}!`);
        } catch (err) {
            console.error('Error in handleJoinProject:', err.message);
            alert(err.message || 'An error occurred while trying to send the join request.');
        }
    };

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

                    {/* Mentors */}
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Mentors:</h3>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                        {project.mentors && project.mentors.length > 0 ? (
                            project.mentors.map((mentor) => (
                                <li key={mentor._id}>{mentor.name}</li>
                            ))
                        ) : (
                            <p className="text-gray-600">No mentors assigned to this project yet.</p>
                        )}
                    </ul>

                    <div className='flex'>
                        {isOwner ? (
                            <>
                                {/* NavLink for Find Teammates */}
                                <NavLink
                                    to={`/dashboard/view-projects/${id}/find-teammates`}
                                    className="p-2 bg-indigo-600 m-1 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    Find Teammates
                                </NavLink>

                                {/* NavLink for Find Mentors */}
                                <NavLink
                                    to={`/dashboard/view-projects/${id}/find-mentor`}
                                    className="p-2 bg-indigo-600 m-1 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    Find Mentors
                                </NavLink>
                            </>
                        ) : (
                            <>
                                {userRole === 'student' && (
                                    <button
                                        onClick={() => handleJoinProject('teammate')}
                                        className="p-2 bg-indigo-600 m-1 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        Join as Teammate
                                    </button>
                                )}
                                {userRole === 'mentor' && (
                                    <button
                                        onClick={() => handleJoinProject('mentor')}
                                        className="p-2 bg-indigo-600 m-1 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        Join as Mentor
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPage;