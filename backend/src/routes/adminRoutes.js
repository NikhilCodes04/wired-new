const express = require('express');
const router = express.Router();
const { getTotalProjects, 
    getTotalStudents, 
    getTotalMentors, 
    getRecentProject, 
    deleteOldRequests,
    getTopStudentsByProjects,
    getProjectsByTechStack,
    getProjectsByStatus,
    getDatabaseGrowth
} = require("../controllers/adminController");

router.get("/total-projects", 
    //verifyToken, authorizeRoles("admin"), 
    getTotalProjects);
router.get("/total-students", 
    //verifyToken, authorizeRoles("admin"), 
    getTotalStudents);
router.get("/total-mentors", 
    //verifyToken, authorizeRoles("admin"), 
    getTotalMentors);
router.get("/recent-project", 
    //verifyToken, authorizeRoles("admin"), 
    getRecentProject);
router.post("/delete-old-requests", //verifyToken, authorizeRoles("admin"), 
deleteOldRequests);

// Get top students by projects
router.get("/top-students", getTopStudentsByProjects);

router.get("/projects-by-tech", getProjectsByTechStack);
router.get("/projects-by-status", getProjectsByStatus);

router.get("/database-growth", getDatabaseGrowth);



module.exports = router;
