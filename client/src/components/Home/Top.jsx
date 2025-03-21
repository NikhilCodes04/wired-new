import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router"; // Import useLocation

function Top() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current route

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); 
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token"); 
        localStorage.removeItem("role"); 
        setIsLoggedIn(false); 
        navigate("/"); 
    };

    return (
        <div className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-bold">Wired</h1>
            {isLoggedIn && location.pathname.startsWith("/dashboard") && ( // Show only on dashboard
                <button
                    onClick={handleLogout}
                    className="bg-white hover:bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-lg transition-colors"
                >
                    Logout
                </button>
            )}
        </div>
    );
}

export default Top;