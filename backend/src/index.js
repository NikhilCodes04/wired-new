const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js'); // Add new admin and role-based routes
const projectRoutes = require('./routes/projectRoutes.js'); // Add new project routes
const requestRoutes = require('./routes/requestRoutes.js'); // Add new request routes
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');

// Initialize the Express app
const app = express();

// CORS options
const corsOptions = {
    origin: '*', // Replace with your allowed origin
    optionsSuccessStatus: 200
};

// Enable CORS middleware with options
app.use(cors(corsOptions));

// Connect to the database
dbConnect();

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to Wired");
});

// Routes
app.use("/api/auth", authRoutes);     
app.use("/api/user", userRoutes);     
app.use("/api/admin", adminRoutes);   
app.use("/api/project", projectRoutes); 
app.use("/api/request", requestRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
 // Request routes


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});