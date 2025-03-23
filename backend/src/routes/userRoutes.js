const express = require('express');
const verifyToken = require('../middlewares/authMiddleware.js');
const authorizeRoles = require('../middlewares/roleMiddleware.js');
const { getAllStudents, getAllMentors, searchMentorsByTechStack, searchStudentsByTechStack,getProfile,updateProfile } = require('../controllers/userController.js');
const router = express.Router();

// Route accessible only by admin
router.get('/admin', verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: 'This is an admin route' });
});

// Route accessible by all logged-in users (students and mentors)
router.get('/user', verifyToken, authorizeRoles("student", "mentor"), (req, res) => {
    res.json({ message: 'This is a user route' });
});

// Route to get all students - accessible by admin or mentors
router.get('/students', verifyToken, authorizeRoles("admin", "mentor","student"), getAllStudents);

// Route to get all mentors - accessible by admin or students
router.get('/mentors', verifyToken, authorizeRoles("admin", "student","mentor"), getAllMentors);

// Route to search mentors by tech stack - accessible by students
router.post('/mentors/search', verifyToken, authorizeRoles("student"), searchMentorsByTechStack);

// Route to search students by tech stack (teammates) - accessible by mentors
router.post('/students/search', verifyToken, authorizeRoles("mentor","student"), searchStudentsByTechStack);

router.get('/profile', verifyToken, getProfile); // Route to get user profile
router.put('/profile', verifyToken, updateProfile); // Route to update user profile


module.exports = router;
