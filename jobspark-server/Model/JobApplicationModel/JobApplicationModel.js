const { default: mongoose } = require("mongoose");

const JobApplicationSchema = mongoose.Schema({

    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActiveJob",
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    }

}, { timestamps: true });

module.exports = mongoose.model("JobApplication", JobApplicationSchema);