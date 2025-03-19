const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a username'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    role: {
        type: String,
        required: [true, 'Please provide a role'],
        enum: ['student', 'mentor', 'admin'],
        default: 'student'
    },
    technologicalStack: {
        type: [String], // Array of strings to represent multiple technologies
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    studentId: {
        type: String,
        required: false
    },
    facultyId: {
        type: String,
        required: false
    }
});

// Methods
userSchema.methods.addSkillSet = function(skill) {
    if (!this.technologicalStack.includes(skill)) {
        this.technologicalStack.push(skill);
        return this.save();
    }
};

userSchema.methods.updateContactInfo = function(contact) {
    this.phoneNumber = contact;
    return this.save();
};

userSchema.methods.changePassword = function(newPwd) {
    this.password = newPwd; // Remember to hash the password in real implementation
    return this.save();
};

// Export the base model
const User = mongoose.model('User', userSchema);
module.exports = User;
