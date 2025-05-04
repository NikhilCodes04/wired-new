const Project = require('../models/projectModel');
const User = require('../models/userModel');

// Add Project function
const addProject = async (req, res) => {
    try {
        const { name, description, technologies = [], teamMembers = [], endDate } = req.body;

        // Ensure required fields are provided
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required fields.' });
        }

        // Ensure the technologies array doesn't exceed the allowed limit
        if (technologies.length > 10) {
            return res.status(400).json({ message: 'A project can have at most 10 technologies.' });
        }

        // Validate team members only if they are provided
        if (teamMembers.length > 0) {
            const membersExist = await User.find({ _id: { $in: teamMembers } });
            if (membersExist.length !== teamMembers.length) {
                return res.status(404).json({ message: 'Some team members do not exist.' });
            }
        }

        // Create the project object
        const newProject = new Project({
            name,
            description,
            technologies,
            teamMembers: teamMembers, // Will be an empty array if not provided
            createdBy: req.user.id, // Authenticated user's ID is stored in req.user
            endDate,
        });

        // Save the project to the database
        const savedProject = await newProject.save();

        res.status(201).json({
            message: 'Project created successfully.',
            project: savedProject,
        });
    } catch (err) {
        console.error('Error creating project:', err.message);
        res.status(500).json({ message: 'Error creating project.', error: err.message });
    }
};



// Get all projects function
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('mentors', 'name email') // Populates mentor details
            .populate('createdBy', 'name email') // Populates creator details
            .populate('teamMembers', 'name email'); // Populates team member details

        res.status(200).json({ projects });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching projects.' });
    }
};

// Get a specific project by ID
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id)
            .populate('mentors', 'name email')
            .populate('createdBy', 'name email')
            .populate('teamMembers', 'name email');

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.status(200).json({ project });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching project.' });
    }
};

// Update project status function
const updateProjectStatus = async (req, res) => {
    try {
        const { id } = req.params; // Project ID from the request parameters
        const { status } = req.body; // New status from the request body

        // Validate the status
        const validStatuses = ['pending', 'active', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Status must be one of ${validStatuses.join(', ')}.` });
        }

        // Find and update the project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true } // Return the updated document and validate the status
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        res.status(200).json({
            message: 'Project status updated successfully.',
            project: updatedProject,
        });
    } catch (err) {
        console.error('Error updating project status:', err.message);
        res.status(500).json({ message: 'Error updating project status.', error: err.message });
    }
};

module.exports = {
    addProject,
    getAllProjects,
    getProjectById,
    updateProjectStatus, 
};