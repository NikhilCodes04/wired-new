const particlesConfig = {
    background: {
        color: {
            value: "#ffffff", // Background color
        },
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: "push", // Add particles on click
            },
            onHover: {
                enable: true,
                mode: "repulse", // Repulse particles on hover
            },
        },
        modes: {
            push: {
                quantity: 4, // Number of particles added on click
            },
            repulse: {
                distance: 200, // Distance for repulsion
                duration: 0.4,
            },
        },
    },
    particles: {
        color: {
            value: "#6366f1", // Particle color (indigo)
        },
        links: {
            color: "#6366f1",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        move: {
            direction: "none",
            enable: true,
            outModes: {
                default: "bounce",
            },
            random: false,
            speed: 2,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 50,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: { min: 1, max: 5 },
        },
    },
    detectRetina: true,
};

export default particlesConfig;