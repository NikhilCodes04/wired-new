import React, { useState, useEffect } from "react";
import Top from "./Top";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import particlesConfig from "../../config/particlesConfig"; // Import the configuration

function Home() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [init, setInit] = useState(false);

  // Initialize the particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // Load the slim version of tsparticles
    }).then(() => {
      setInit(true); // Mark initialization as complete
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles Loaded:", container);
  };

  return (
    <div className="relative h-screen">
      {/* Particle Animation */}
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particlesConfig} // Use the imported configuration
          className="absolute inset-0 z-0"
        />
      )}

      {/* Main Content */}
      <div className="relative z-10">
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
              Join Wired to find the perfect project teammates and mentors.
              Whether you're a student looking to build something amazing or a
              mentor ready to guide the next generation.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => setShowRegister(true)}
                className="w-40 h-14 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors text-lg flex items-center justify-center"
              >
                Get Started
              </button>

              <button
                onClick={() => setShowLogin(true)}
                className="w-40 h-14 px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-colors text-lg flex items-center justify-center"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Render Modals */}
        {showRegister && <Register onClose={() => setShowRegister(false)} />}
        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </div>
    </div>
  );
}

export default Home;