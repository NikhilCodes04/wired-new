const express = require('express');
const { addProject, getAllProjects, getProjectById } = require('../controllers/projectController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const Project = require('../models/projectModel'); // Assuming you have a project model defined
const router = express.Router();

// Route to add a new project - Requires authentication
router.post('/add', verifyToken, addProject);

// Route to get all projects - Accessible by admin or users with the required role
router.get('/', verifyToken, authorizeRoles('admin', 'mentor', 'student'), getAllProjects);



router.get('/search', verifyToken, async (req, res) => {
    try {
        console.log('Token:', req.headers.authorization);
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const results = await Project.find(
            { $text: { $search: q } },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });

        res.status(200).json({ projects: results });
    } catch (err) {
        console.error('Error in /project/search:', err.message);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Route to get a specific project by ID - Accessible by anyone with the required token
router.get('/:id', verifyToken, getProjectById);

module.exports = router;
