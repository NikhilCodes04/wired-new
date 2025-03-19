const Event = require('../models/eventModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');

// Add Event function
const addEvent = async (req, res) => {
    try {
        const { title, description, date, targetAudience } = req.body;

        // Ensure required fields are provided
        if (!title || !description || !date || !targetAudience) {
            return res.status(400).json({ message: 'Title, description, date, and target audience are required fields.' });
        }

        // Validate target audience roles
        const validRoles = ['mentor', 'student'];
        const invalidRoles = targetAudience.filter(role => !validRoles.includes(role));
        if (invalidRoles.length > 0) {
            return res.status(400).json({ message: `Invalid roles in target audience: ${invalidRoles.join(', ')}` });
        }

        // Create the event
        const createdBy = req.user.id; // Authenticated user's ID
        const newEvent = new Event({
            title,
            description,
            date,
            targetAudience,
            createdBy,
        });

        const savedEvent = await newEvent.save();

        // Notify target audience
        const recipients = await User.find({ role: { $in: targetAudience } }, '_id');
        const notifications = recipients.map(user => ({
            recipient: user._id,
            type: 'event',
            message: `New event: ${title}`,
            relatedEntity: savedEvent._id,
        }));

        await Notification.insertMany(notifications);

        res.status(201).json({
            message: 'Event created successfully, and notifications sent.',
            event: savedEvent,
        });
    } catch (err) {
        console.error('Error creating event:', err.message);
        res.status(500).json({ message: 'Error creating event.', error: err.message });
    }
};

// Get all events function
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('createdBy', 'name email') // Populates creator details
            .sort({ date: 1 }); // Sort by date ascending

        res.status(200).json({ events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching events.' });
    }
};

// Get a specific event by ID function
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id)
            .populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.status(200).json({ event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching event.' });
    }
};

module.exports = {
    addEvent,
    getAllEvents,
    getEventById,
};
