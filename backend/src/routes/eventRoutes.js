const express = require('express');
const { addEvent, getAllEvents, getEventById } = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Route to add a new event - Only Admins
router.post('/add', verifyToken, authorizeRoles('admin'), addEvent);

// Route to get all events - Accessible by Admin, Mentors, and Students
router.get('/', verifyToken, authorizeRoles('admin', 'mentor', 'student'), getAllEvents);

// Route to get a specific event by ID - Accessible by any authenticated user
router.get('/:id', verifyToken, getEventById);

module.exports = router;
