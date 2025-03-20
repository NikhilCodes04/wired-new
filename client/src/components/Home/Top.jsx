import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function Top() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

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
            {isLoggedIn && (
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