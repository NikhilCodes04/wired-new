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


const getTopStudentsByProjects = async (req, res) => {
    try {
        const students = await Project.aggregate([
            {
                $lookup: {
                    from: "users", // Join with the users collection
                    localField: "teamMembers",
                    foreignField: "_id",
                    as: "teamDetails",
                },
            },
            {
                $unwind: {
                    path: "$teamDetails", // Flatten team members
                    preserveNullAndEmptyArrays: true, // Allow projects with no team members
                },
            },
            {
                $group: {
                    _id: {
                        $ifNull: ["$teamDetails._id", "$createdBy"], // Use team member ID or fallback to createdBy
                    },
                    name: { $first: "$teamDetails.name" }, // Get the user's name
                    email: { $first: "$teamDetails.email" }, // Get the user's email
                    projectCount: { $sum: 1 }, // Count the number of projects
                },
            },
            {
                $lookup: {
                    from: "users", // Join again to fetch details for createdBy users
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    name: { $ifNull: ["$name", "$userDetails.name"] }, // Use name from teamDetails or userDetails
                    email: { $ifNull: ["$email", "$userDetails.email"] }, // Use email from teamDetails or userDetails
                },
            },
            {
                $sort: { projectCount: -1 }, // Sort by project count in descending order
            },
            {
                $limit: 5, // Limit to top 5 students
            },
        ]);

        res.status(200).json({ students });
    } catch (err) {
        res.status(500).json({ message: "Error fetching top students", error: err.message });
    }
};

const getProjectsByTechStack = async (req, res) => {
    try {
        const projectsByTech = await Project.aggregate([
            { $unwind: "$technologies" },
            {
                $group: {
                    _id: "$technologies",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        res.status(200).json({ projectsByTech });
    } catch (err) {
        res.status(500).json({ message: "Error fetching projects by tech stack", error: err.message });
    }
};


const getProjectsByStatus = async (req, res) => {
    try {
        const projectsByStatus = await Project.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({ projectsByStatus });
    } catch (err) {
        res.status(500).json({ message: "Error fetching projects by status", error: err.message });
    }
};

const getDatabaseGrowth = async (req, res) => {
    try {
        // Aggregate student growth
        const studentsGrowth = await User.aggregate([
            { $match: { role: "student" } }, // Filter only students
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Aggregate mentor growth
        const mentorsGrowth = await User.aggregate([
            { $match: { role: "mentor" } }, // Filter only mentors
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Aggregate project growth
        const projectsGrowth = await Project.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Format the response for better readability
        const formatGrowthData = (data) =>
            data.map((item) => ({
                date: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
                count: item.count,
            }));

        res.status(200).json({
            studentsGrowth: formatGrowthData(studentsGrowth),
            mentorsGrowth: formatGrowthData(mentorsGrowth),
            projectsGrowth: formatGrowthData(projectsGrowth),
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching database growth", error: err.message });
    }
};




module.exports = {
    getTotalProjects,
    getTotalStudents,
    getTotalMentors,
    getRecentProject,
    deleteOldRequests,
    getTopStudentsByProjects,
    getProjectsByTechStack,
    getProjectsByStatus,
    getDatabaseGrowth,
};