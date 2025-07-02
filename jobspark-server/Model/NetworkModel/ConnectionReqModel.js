const mongoose = require('mongoose');

const ConnectionReqModel = new mongoose.Schema({
    //who is sending
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    //whome is receiving
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    //what is the status
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    //when is created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// module.exports = mongoose.model("ConnectionRequest", ConnectionReqModel);

module.exports = mongoose.model('ConnectionRequest', ConnectionReqModel);

