const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ['sent', 'pending'], default: 'pending' },
    timestamp: { type: Date, default: Date.now },
    type: {
        type: String,
        enum: {
            values: [
                'profile_incomplete',   // user needs to complete their profile
                'account_suspended',    // user account suspended
                'reminder',             // reminder notifications
                'warning',              // warning related notification
            ],
            message: '{VALUE} is not a valid notification type'  // Custom error message
        },
        required: true
    }, // e.g., profile completion, suspension, etc.
});

module.exports = mongoose.model("AdminNotificationModel", adminNotificationSchema);
