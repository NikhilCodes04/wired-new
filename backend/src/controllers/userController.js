const User = require('../models/userModel');

// Retrieve all students
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select(
            'name email phoneNumber technologicalStack'
        ); // Select only relevant fields

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found.' });
        }

        res.status(200).json({ message: 'Students retrieved successfully', students });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students', error: error.message });
    }
};

// Retrieve all mentors
const getAllMentors = async (req, res) => {
    try {
        const mentors = await User.find({ role: 'mentor' });
        res.status(200).json({ message: 'Mentors retrieved successfully', mentors });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving mentors', error: error.message });
    }
};

// Search for mentors based on tech stack
const searchMentorsByTechStack = async (req, res) => {
    try {
        const { techStack } = req.body; // techStack should be an array of skills to match

        const mentors = await User.find({
            role: 'mentor',
            technologicalStack: { $in: techStack }
        });

        if (mentors.length === 0) {
            return res.status(404).json({ message: 'No mentors found with the specified tech stack' });
        }

        res.status(200).json({ message: 'Mentors retrieved successfully', mentors });
    } catch (error) {
        res.status(500).json({ message: 'Error searching for mentors', error: error.message });
    }
};

// Search for students based on tech stack (for teammate matching)
const searchStudentsByTechStack = async (req, res) => {
    try {
        const { techStack } = req.body; // techStack should be an array of skills to match

        // If techStack is empty or not provided, fetch all students
        const query = {
            role: 'student',
            ...(techStack && techStack.length > 0 && { technologicalStack: { $in: techStack } }),
        };

        const students = await User.find(query);

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found.' });
        }

        res.status(200).json({ message: 'Students retrieved successfully', students });
    } catch (error) {
        res.status(500).json({ message: 'Error searching for students', error: error.message });
    }
};


const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User profile retrieved successfully',
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                technologicalStack: user.technologicalStack,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user profile', error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `req.user` contains the authenticated user's ID
        const { name, phoneNumber, technologicalStack } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.name = name || user.name;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.technologicalStack = technologicalStack || user.technologicalStack;

        await user.save();

        res.status(200).json({
            message: 'User profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                technologicalStack: user.technologicalStack,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
};

module.exports = {
    getAllStudents,
    getAllMentors,
    searchMentorsByTechStack,
    searchStudentsByTechStack,
    getProfile, // Added getProfile
    updateProfile, // Added updateProfile
};