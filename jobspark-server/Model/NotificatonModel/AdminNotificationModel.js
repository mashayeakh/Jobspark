const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ['sent', 'pending'], default: 'pending' },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, required: true }, // e.g., profile completion, suspension, etc.
});

module.exports = mongoose.model("AdminNotificationModel", adminNotificationSchema);
