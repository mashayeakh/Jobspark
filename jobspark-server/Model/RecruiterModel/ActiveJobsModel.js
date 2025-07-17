const { default: mongoose } = require("mongoose");

const ActiveJobSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    employeeType: {
        type: String,
        required: true,
        enum: ['Full time', 'Part time', 'Internship'],
    },
    experienceLevel: {
        type: String,
        required: true,
        enum: ['Entry', 'Mid', 'Senior'],
    },
    jobCategory: {
        type: String,
        required: true,
        enum: [
            'software_dev',
            'web_dev',
            'ai_ml',
            'content_writing',
            'digital_marketing',
            'social_media',
            'ui_ux',
            'graphic_design',
            'video_editing'
        ],
    },
    skills: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: Number,
        required: true,
        trim: true
    },
    deadline: {
        type: Date,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        default: "Ongoing"
    },
    qualification: {
        type: String,
        required: true,
        trim: true
    },
    responsibility: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    applicantsCount: {
        type: Number,
        default: 0,
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    }


}, { timestamps: true });

module.exports = mongoose.model("ActiveJob", ActiveJobSchema);