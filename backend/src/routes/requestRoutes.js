const express = require('express');
const verifyToken = require('../middlewares/authMiddleware.js');
const authorizeRoles = require('../middlewares/roleMiddleware.js');
const {
    sendRequest,
    getRequestsByUser,
    updateRequestStatus,
    getRequestsForProject,
    cancelRequest,
} = require('../controllers/requestController.js');

const router = express.Router();

// Route to send a connection request (accessible by students or mentors)
router.post(
    '/send',
    verifyToken,
    // This route can be accessed by both students and mentors
    sendRequest
);

// Route to get all requests for the logged-in user (accessible by students or mentors)
router.get(
    '/user',
    verifyToken,
    // This route can be accessed by both students and mentors
    getRequestsByUser
);

// Route to get all requests for a specific project (accessible by project leader)
router.get(
    '/project/:projectId',
    verifyToken,
    // Ensure only the project leader (admin/student/mentor with project permissions) can access
    authorizeRoles('admin', 'student', 'mentor'), 
    getRequestsForProject
);

// Route to update the status of a request (accessible by admin or receiver)
router.patch(
    '/update/:requestId',
    verifyToken,
    // Ensure only the admin or the receiver (student/mentor) can update the status
    authorizeRoles('admin', 'student', 'mentor'),
    updateRequestStatus
);


router.patch(
    '/cancel/:requestId',
    verifyToken,
    // Only the sender can cancel the request
    cancelRequest
);

module.exports = router;
