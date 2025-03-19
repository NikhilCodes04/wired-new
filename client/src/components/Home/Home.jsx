import React from "react";
import { NavLink } from "react-router"; // Corrected import
import Top from "./Top"; // Removed curly braces for default export

function Home() {
  return (
    <div>
    <Top />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      <div className="text-center">
        <h1 className="text-5xl font-bold text-indigo-600 mb-2">
          Welcome to Wired
        </h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-6">
          Connect. Collaborate. Create.
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Join Wired to find the perfect project teammates and mentors. Whether
          you're a student looking to build something amazing or a mentor ready
          to guide the next generation.
        </p>
        <div className="flex justify-center space-x-6">
          <NavLink to="/login" end>
            <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors text-lg">
              Get Started
            </button>
          </NavLink>

          <button className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors text-lg">
            Learn More
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Home;