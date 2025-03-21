import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Loader } from 'lucide-react'; // Import Loader icon
import config from '../../config/config';

export function Register({ onClose }) {
    const [userType, setUserType] = useState('student');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        college: '',
        department: '',
        skills: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // State to track loading
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error message
        setLoading(true); // Set loading to true
        try {
            const response = await axios.post(`${config.API_BASE_URL}/auth/register`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: userType,
                technologicalStack: formData.skills.split(',').map((skill) => skill.trim()),
                phoneNumber: '',
                studentId: userType === 'student' ? formData.college : undefined,
                facultyId: userType === 'mentor' ? formData.department : undefined,
            });
            console.log('User registered successfully:', response.data);

            // Close the modal before navigating
            if (onClose) onClose();

            // Navigate to the login page
            navigate('/login');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Registration failed:', error.response?.data || error.message);

                // Handle specific error messages from the server
                if (error.response?.data?.message === 'Email already registered.') {
                    setError('The email address is already registered. Please use a different email.');
                } else if (error.response?.data?.message === 'Password too short.') {
                    setError('The password must be at least 8 characters long.');
                } else {
                    setError(error.response?.data?.message || 'An error occurred during registration. Please try again.');
                }
            } else {
                console.error('Registration failed:', error);
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-3"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(5px)",
            }}>
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                <div className="flex space-x-4 mb-2">
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg ${userType === 'student'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        onClick={() => setUserType('student')}
                    >
                        Student
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 rounded-lg ${userType === 'mentor'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        onClick={() => setUserType('mentor')}
                    >
                        Mentor
                    </button>
                </div>
                {error && ( // Display error message if it exists
                    <div className="mb-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Create a password"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                        <input
                            type="text"
                            value={formData.college}
                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your college name"
                            required
                        />
                    </div>
                    {userType === 'mentor' ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your department"
                                required
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                            <input
                                type="text"
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your skills (comma separated)"
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <Loader className="animate-spin h-5 w-5 text-white" /> // Show loader when loading
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;