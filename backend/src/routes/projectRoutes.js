const express = require('express');
const { addProject, getAllProjects, getProjectById } = require('../controllers/projectController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route to add a new project - Requires authentication
router.post('/add', verifyToken, addProject);

// Route to get all projects - Accessible by admin or users with the required role
router.get('/', verifyToken, authorizeRoles('admin', 'mentor', 'student'), getAllProjects);

// Route to get a specific project by ID - Accessible by anyone with the required token
router.get('/:id', verifyToken, getProjectById);

module.exports = router;
