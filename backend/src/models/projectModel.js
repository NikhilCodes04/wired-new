const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Project description is required'],
            minlength: [10, 'Description must be at least 10 characters'],
        },
        technologies: {
            type: [String],
            validate: {
                validator: function (array) {
                    return array.length <= 10;
                },
                message: 'A project can have at most 10 technologies',
            },
            default: [],
        },
        mentors: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // Mentor is optional
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Project creator is required'],
        },
        teamMembers: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
            validate: {
                validator: function (array) {
                    return Array.isArray(array) && new Set(array).size === array.length;
                },
                message: 'Duplicate members are not allowed',
            },
        },
        status: {
            type: String,
            enum: {
                values: ['active', 'completed', 'pending'],
                message: 'Status must be one of "active", "completed", or "pending"',
            },
            default: 'pending',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            validate: {
                validator: function (value) {
                    return !value || value > this.startDate; // Allow null or ensure it's after startDate
                },
                message: 'End date must be after the start date',
            },
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

// Example of an instance method
projectSchema.methods.isOverdue = function () {
    return this.endDate && this.endDate < Date.now();
};

// Add text index on both fields
projectSchema.index({ description: 'text', technologies: 'text' });

// Export the model
const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
