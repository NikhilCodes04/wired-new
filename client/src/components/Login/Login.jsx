import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Mail, Lock, Loader } from 'lucide-react'; // Import Loader icon
import { jwtDecode } from "jwt-decode";
import config from "../../config/config.js";

function Login({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State to store error message
    const [loading, setLoading] = useState(false); // State to track loading
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous error message
        setLoading(true); // Set loading to true
        try {
            const response = await axios.post(`${config.API_BASE_URL}/auth/login`, { email, password });

            // Store the token in localStorage
            localStorage.setItem("token", response.data.token);

            // Decode the token to extract the user role
            const decodedToken = jwtDecode(response.data.token);
            const userRole = decodedToken.role;

            // Store the user role in localStorage
            localStorage.setItem("role", userRole);

            console.log("Logged in successfully:", response.data);
            console.log("User role:", userRole);

            // Navigate to the dashboard after successful login
            if (onClose) onClose(); // Close the login modal if onClose is provided
            navigate("/dashboard");
        } catch (error) {
            console.error("Login or authorization error:", error.response?.data || error.message);

            // Handle specific error messages from the server
            if (error.response?.data?.message === "User not found.") {
                setError("The email address you entered is not registered.");
            } else if (error.response?.data?.message === "Invalid credentials.") {
                setError("Incorrect password. Please try again.");
            } else {
                setError(error.response?.data?.message || "An error occurred during login. Please try again.");
            }
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(5px)",
            }}>
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Log In</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                {error && ( // Display error message if it exists
                    <div className="mb-4 text-red-500 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <Loader className="animate-spin h-5 w-5 text-white" /> // Show loader when loading
                        ) : (
                            "Log In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;