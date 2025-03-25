const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js'); 
const projectRoutes = require('./routes/projectRoutes.js'); 
const requestRoutes = require('./routes/requestRoutes.js'); 
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');

const app = express();

// CORS options
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

dbConnect();

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


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});