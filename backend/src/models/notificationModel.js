const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String, // e.g., 'event', 'teamRequest'
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId, // Links to Event/Project/etc.
        refPath: 'type', // Dynamic reference
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
