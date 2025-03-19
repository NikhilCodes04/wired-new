const Notification = require('../models/notificationModel');

// Get Notifications for the Logged-In User
const getNotifications = async (req, res) => {
    try {
        // Fetch notifications for the logged-in user
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 }); // Most recent notifications first

        res.status(200).json({ notifications });
    } catch (err) {
        console.error('Error fetching notifications:', err.message);
        res.status(500).json({ message: 'Error fetching notifications.', error: err.message });
    }
};

// Mark a Notification as Read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        // Update the notification's read status
        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        res.status(200).json({
            message: 'Notification marked as read successfully.',
            notification,
        });
    } catch (err) {
        console.error('Error marking notification as read:', err.message);
        res.status(500).json({ message: 'Error marking notification as read.', error: err.message });
    }
};

// Get Unread Notifications Count
const getUnreadNotificationsCount = async (req, res) => {
    try {
        // Count unread notifications for the logged-in user
        const count = await Notification.countDocuments({ recipient: req.user.id, isRead: false });

        res.status(200).json({ count });
    } catch (err) {
        console.error('Error fetching unread notifications count:', err.message);
        res.status(500).json({ message: 'Error fetching unread notifications count.', error: err.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    getUnreadNotificationsCount,
};
