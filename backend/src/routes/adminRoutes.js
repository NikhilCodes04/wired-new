const express = require('express');
const verifyToken = require('../middlewares/authMiddleware.js');
const authorizeRoles = require('../middlewares/roleMiddleware.js');
const { getAllStudents, getAllMentors, searchMentorsByTechStack, searchStudentsByTechStack } = require('../controllers/userController.js');
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
router.get('/students', verifyToken, authorizeRoles("admin", "mentor"), async (req, res) => {
    try {
        const students = await getAllStudents(); // Assuming this returns student data
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
});

// Route to get all mentors - accessible by admin or students
router.get('/mentors', verifyToken, authorizeRoles("admin", "student"), async (req, res) => {
    try {
        const mentors = await getAllMentors(); // Assuming this returns mentor data
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch mentors", error: error.message });
    }
});

// Route to search mentors by tech stack - accessible by students
router.post('/mentors/search', verifyToken, authorizeRoles("student"), async (req, res) => {
    try {
        const { techStack } = req.body;
        if (!techStack) {
            return res.status(400).json({ message: "Tech stack is required" });
        }
        const mentors = await searchMentorsByTechStack(techStack); // Assuming this searches by tech stack
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: "Failed to search mentors", error: error.message });
    }
});

// Route to search students by tech stack (teammates) - accessible by mentors
router.post('/students/search', verifyToken, authorizeRoles("mentor"), async (req, res) => {
    try {
        const { techStack } = req.body;
        if (!techStack) {
            return res.status(400).json({ message: "Tech stack is required" });
        }
        const students = await searchStudentsByTechStack(techStack); // Assuming this searches by tech stack
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Failed to search students", error: error.message });
    }
});

module.exports = router;
