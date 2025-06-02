const { application } = require("express");
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
    },
    // applicationAppliedTo: {
    //     type: Number,
    //     default: 0,
    // }

}, { timestamps: true });

module.exports = mongoose.model("JobApplication", JobApplicationSchema);