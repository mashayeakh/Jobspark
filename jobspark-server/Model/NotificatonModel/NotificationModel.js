//we will create notification model here
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String, //"remainde , interview"
        default: "general"
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    //extra fields for detiled view
    applicantId: {
        type: String
    },
    applicantName: {
        type: String
    },
    interviewDate: {
        type: Date
    },
    location: {
        type: String
    },
    interviewer: {
        type: String
    }
});

module.exports = mongoose.model("NotificationModel", notificationSchema);