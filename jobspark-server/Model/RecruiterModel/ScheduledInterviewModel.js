const { default: mongoose } = require("mongoose");

const ScheduledInterViewSchema = mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActiveJob",
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    interviewType: {
        type: String,
        enum: ["Google Meet"],
        required: true,
    },
    interviewLink: {
        type: String,
        // required: true,
    },
    notes: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("ScheduledInterview", ScheduledInterViewSchema);