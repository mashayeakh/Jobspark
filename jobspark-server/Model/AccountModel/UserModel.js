const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    company_role: { type: String, required: true },
    website: { type: String, required: true },
});

const educationSchema = new mongoose.Schema({
    degree: String,
    institution: String,
    year: String,
});

const socialLinksSchema = new mongoose.Schema({
    linkedin: String,
    github: String,
    portfolio: String,
});

const applicationSchema = new mongoose.Schema({
    appliedApplicationCount: {
        type: Number,
        default: 0,
        required: function () {
            return this.role === "job_seeker";
        },
    },
    appliedJobIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Job",
        default: [],
        required: function () {
            return this.role === "job_seeker";
        },
    },
})

const jobSeekerProfileSchema = new mongoose.Schema({
    education: [educationSchema],
    socialLinks: socialLinksSchema,
    university: String,
    roles: String,
    phoneNumber: String,
    bio: String,
    profileImage: String,
    application: [applicationSchema],
    preferredJobTitles: [String],
    preferredLocations: [String],
    resume: String,
    certificates: [String],
    isProfileComplete: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    location: { type: String },
    role: { type: String, enum: ["job_seeker", "recruiter", "admin"], required: true },

    // Recruiter-specific
    recruiterProfile: {
        type: recruiterProfileSchema,
        required: function () {
            return this.role === "recruiter";
        },
    },

    // Job seeker–specific
    jobSeekerProfile: {
        type: jobSeekerProfileSchema,
        required: function () {
            return this.role === "job_seeker";
        },
    },
    skills: {
        type: [String],
        default: undefined,
        required: function () {
            return this.role === "job_seeker";
        },
    },
    experienceLevel: {
        type: String,
        required: function () {
            return this.role === "job_seeker";
        },
    },
    // Common
    lastSignInTime: { type: Date },
    isGeneratedByAI: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
