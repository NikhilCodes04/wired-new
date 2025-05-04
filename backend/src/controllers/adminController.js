const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Request = require("../models/requestModel");

// 1. Aggregation - Total number of projects
const getTotalProjects = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments({});
        res.status(200).json({ totalProjects });
    } catch (err) {
        res.status(500).json({ message: "Error fetching total projects", error: err.message });
    }
};

// 2. Total number of students
const getTotalStudents = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: "student" });
        res.status(200).json({ totalStudents });
    } catch (err) {
        res.status(500).json({ message: "Error fetching total students", error: err.message });
    }
};

// 3. Total number of mentors
const getTotalMentors = async (req, res) => {
    try {
        const totalMentors = await User.countDocuments({ role: "mentor" });
        res.status(200).json({ totalMentors });
    } catch (err) {
        res.status(500).json({ message: "Error fetching total mentors", error: err.message });
    }
};

// 4. Recent project added
const getRecentProject = async (req, res) => {
    try {
        const recentProject = await Project.findOne().sort({ createdAt: -1 });
        res.status(200).json({ recentProject });
    } catch (err) {
        res.status(500).json({ message: "Error fetching recent project", error: err.message });
    }
};

// 5. Delete old pending/cancelled/accepted requests
const deleteOldRequests = async (req, res) => {
    try {
        const { status, olderThanDate } = req.body;
        if (!status || !olderThanDate) {
            return res.status(400).json({ message: "Status and olderThanDate are required" });
        }

        const result = await Request.deleteMany({
            status: { $in: status },
            createdAt: { $lt: new Date(olderThanDate) },
        });

        res.status(200).json({ message: "Old requests deleted successfully", result });
    } catch (err) {
        res.status(500).json({ message: "Error deleting old requests", error: err.message });
    }
};

module.exports = {
    getTotalProjects,
    getTotalStudents,
    getTotalMentors,
    getRecentProject,
    deleteOldRequests,
};