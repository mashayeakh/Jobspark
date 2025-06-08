const { default: mongoose, Schema } = require("mongoose");

const RecruiterActivityModel = mongoose.Schema({

    //recrutier info
    recruiter: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: "ActiveJob",
        required: true,
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['shortlisted', 'rejected', 'scheduled'],
        required: true
    },
    message: {
        type: String,
        default: ''
    },
    scheduledInterviewDate: {
        type: Date,
        required: function () {
            return this.status === 'scheduled';
        }
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true });

// prevent duplicates
RecruiterActivityModel.index({ recruiter: 1, job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("RecruiterActivity", RecruiterActivityModel);