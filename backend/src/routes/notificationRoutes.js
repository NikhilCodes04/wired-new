const express = require('express');
const { getNotifications, markAsRead, getUnreadNotificationsCount } = require('../controllers/notificationController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to get all notifications for the logged-in user
router.get('/', verifyToken, getNotifications);

// Route to mark a notification as read
router.patch('/:id/read', verifyToken, markAsRead);

// Route to get the count of unread notifications for the logged-in user
router.get('/unread-count', verifyToken, getUnreadNotificationsCount);

module.exports = router;
