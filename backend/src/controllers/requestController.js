const Request = require('../models/requestModel.js'); // Assuming you have a Request model
const Project = require('../models/projectModel.js');
const User = require('../models/userModel.js'); // Assuming you have a User model

// Send a new request
const sendRequest = async (req, res) => {
    const { receiverId, projectId, type } = req.body;
    const senderId = req.user.id; // Get senderId from the authenticated user

    try {
        // Fetch the project details
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Ensure mentors field is an array before checking includes
        if (type === 'mentor_request' && Array.isArray(project.mentors) && project.mentors.includes(senderId)) {
            return res.status(400).json({ message: 'You are already a mentor for this project.' });
        }

        // Ensure teamMembers field is an array before checking includes
        if (type === 'teammate_request' && Array.isArray(project.teamMembers) && project.teamMembers.includes(senderId)) {
            return res.status(400).json({ message: 'You are already a teammate for this project.' });
        }

        // Proceed with creating the request
        const newRequest = new Request({
            senderId,
            receiverId,
            projectId,
            type,
            status: 'pending', // Default status is 'pending'
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request sent successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending request', error: err.message });
    }
};

// Retrieve all requests for a user (student or mentor)
const getRequestsByUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const requests = await Request.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        })
            .populate('senderId', 'name email') // Populate sender details
            .populate('receiverId', 'name email') // Populate receiver details
            .populate('projectId', 'name') // Populate project details
            .exec();

        res.status(200).json({ message: 'Requests retrieved successfully', requests });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching requests', error: err.message });
    }
};

// Retrieve all requests for a specific project
const getRequestsForProject = async (req, res) => {
    const { projectId } = req.params;

    try {
        const requests = await Request.find({ projectId })
            .populate('senderId', 'name email') // Populate sender details
            .populate('receiverId', 'name email') // Populate receiver details
            .exec();

        res.status(200).json({ message: 'Project requests retrieved successfully', requests });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project requests', error: err.message });
    }
};

// Update the status of a request (approve or reject)
const updateRequestStatus = async (req, res) => {
    const { requestId } = req.params;
    const { status } = req.body;

    try {
        // Find the request by ID
        const request = await Request.findById(requestId)
            .populate('receiverId', 'name email') // Populate receiver details for authorization check
            .populate('senderId', 'name email') // Populate sender details
            .populate('projectId', 'name teamMembers mentors'); // Populate project details

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Ensure that the user is the receiver of the request
        if (request.receiverId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this request status' });
        }

        // Validate status (Only 'accepted' or 'rejected' are valid statuses)
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Only "accepted" or "rejected" are allowed.' });
        }

        // Update the request status
        request.status = status;
        await request.save();

        // If the status is 'accepted', update the project based on request type
        if (status === 'accepted') {
            const project = request.projectId;

            if (request.type === 'teammate_request') {
                // Use `some` to check if receiverId is already in the team
                const isAlreadyTeammate = project.teamMembers.some(
                    (member) => member.toString() === request.receiverId.toString()
                );
                if (!isAlreadyTeammate) {
                    project.teamMembers.push(request.receiverId);
                    await project.save();
                }
            } else if (request.type === 'mentor_request') {
                // Use `some` to check if receiverId is already a mentor
                const isAlreadyMentor = project.mentors.some(
                    (mentor) => mentor.toString() === request.receiverId.toString()
                );
                if (!isAlreadyMentor) {
                    project.mentors.push(request.receiverId);
                    await project.save();
                }
            }
        }

        res.status(200).json({ message: 'Request status updated successfully', request });
    } catch (err) {
        res.status(500).json({ message: 'Error updating request status', error: err.message });
    }
};


module.exports = {
    sendRequest,
    getRequestsByUser,
    getRequestsForProject,
    updateRequestStatus,
};
