const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ['sent', 'pending'],
        default: 'pending'
    },
    timestamp: { type: Date, default: Date.now },
    type: {
        type: String,
        enum: {
            values: [
                'profile_incomplete',   // initial profile check (step 1)
                'warning',              // 24h warning sent (step 2)
                'account_suspended',    // profile still incomplete after 24h

            ],
            message: '{VALUE} is not a valid notification type'
        },
        required: true
    },
    // ✅ NEW FIELD: To track how many times a notification has occurred
    occurrences: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model("AdminNotificationModel", adminNotificationSchema);
