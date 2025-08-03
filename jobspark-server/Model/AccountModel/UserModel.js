// const mongoose = require("mongoose");

// const recruiterProfileSchema = new mongoose.Schema({
//     company_name: { type: String, required: true },
//     company_role: { type: String, required: true },
//     website: { type: String, required: true },
// });

// const educationSchema = new mongoose.Schema({
//     degree: String,
//     institution: String,
//     year: String,
// });

// const socialLinksSchema = new mongoose.Schema({
//     linkedin: String,
//     github: String,
//     portfolio: String,
// });

// const applicationSchema = new mongoose.Schema({
//     appliedApplicationCount: {
//         type: Number,
//         default: 0,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
//     appliedJobIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "Job",
//         default: [],
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
// })

// const jobSeekerProfileSchema = new mongoose.Schema({
//     education: [educationSchema],
//     socialLinks: socialLinksSchema,
//     university: String,
//     roles: String,
//     phoneNumber: String,
//     bio: String,
//     profileImage: String,
//     application: [applicationSchema],
//     preferredJobTitles: [String],
//     preferredLocations: [String],
//     resume: String,
//     certificates: [String],
//     isProfileComplete: { type: Boolean, default: false },
// });

// const userSchema = new mongoose.Schema({
//     name: { type: String },
//     email: { type: String },
//     password: { type: String },
//     location: { type: String },
//     role: { type: String, enum: ["job_seeker", "recruiter", "admin"], required: true },

//     // Recruiter-specific
//     recruiterProfile: {
//         type: recruiterProfileSchema,
//         required: function () {
//             return this.role === "recruiter";
//         },
//     },

//     // Job seeker–specific
//     jobSeekerProfile: {
//         type: jobSeekerProfileSchema,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
//     skills: {
//         type: [String],
//         default: undefined,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
//     experienceLevel: {
//         type: String,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
//     // Common
//     lastSignInTime: { type: Date },
//     isGeneratedByAI: { type: Boolean, default: false },
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);



// const mongoose = require("mongoose");

// const recruiterProfileSchema = new mongoose.Schema({
//     company_name: { type: String, required: true },
//     company_role: { type: String, required: true },
//     website: { type: String, required: true },
// });

// const educationSchema = new mongoose.Schema({
//     degree: String,
//     institution: String,
//     year: String,
// });

// const socialLinksSchema = new mongoose.Schema({
//     linkedin: String,
//     github: String,
//     portfolio: String,
// });

// const applicationSchema = new mongoose.Schema({
//     appliedApplicationCount: {
//         type: Number,
//         default: 0,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
//     appliedJobIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "Job",
//         default: [],
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
// });

// const jobSeekerProfileSchema = new mongoose.Schema({
//     education: [educationSchema],
//     socialLinks: socialLinksSchema,
//     university: String,
//     roles: String,
//     phoneNumber: String,
//     bio: String,
//     profileImage: String,
//     application: [applicationSchema],
//     preferredJobTitles: [String],
//     preferredLocations: [String],
//     resume: String,
//     certificates: [String],
//     isProfileComplete: { type: Boolean, default: false },
//     //* Fields related to suspension
//     isSuspended: { type: Boolean, default: false }, // Flag to indicate if profile is suspended
//     suspensionReason: { type: String, default: "" }, // Reason for suspension
//     suspendedBy: { type: String, default: "" }, // Who suspended the profile (usually admin)
//     suspensionDate: { type: Date, default: null }, // Date when the profile was suspended
//     reactivationDate: { type: Date, default: null }, // (Optional) When the profile gets reactivated
// });

// const userSchema = new mongoose.Schema({
//     name: { type: String },
//     email: { type: String },
//     password: { type: String },
//     location: { type: String },
//     role: { type: String, enum: ["job_seeker", "recruiter", "admin"], required: true },

//     // Recruiter-specific
//     recruiterProfile: {
//         type: recruiterProfileSchema,
//         required: function () {
//             return this.role === "recruiter";
//         },
//     },

//     // Job seeker–specific
//     jobSeekerProfile: {
//         type: jobSeekerProfileSchema,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
//     skills: {
//         type: [String],
//         default: undefined,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },
//     experienceLevel: {
//         type: String,
//         required: function () {
//             return this.role === "job_seeker";
//         },
//     },

//     // Common
//     lastSignInTime: { type: Date },
//     isGeneratedByAI: { type: Boolean, default: false },
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);


const mongoose = require("mongoose");

const jobSeekerProfileSchema = new mongoose.Schema({
    preferredJobTitles: [{ type: String }],
    preferredLocations: [{ type: String }],
    certificates: [{ type: String }],
    education: [{ type: String }],
    application: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    isProfileComplete: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String, default: "" },
    suspendedBy: { type: String, default: "" },
    suspensionDate: { type: Date, default: null },
    reactivationDate: { type: Date, default: null },

    // ✅ Verification for Job Seekers
    isVerified: { type: Boolean, default: false },
    verifiedFields: {
        resumeVerified: { type: Boolean, default: false }, // ✅ you're verifying CV/resume
    },
    verifiedAt: { type: Date, default: null }
});

const recruiterProfileSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    company_role: { type: String, required: true },
    website: { type: String, required: true },

    // ✅ Verification for Recruiters
    isVerified: { type: Boolean, default: false },
    verifiedFields: {
        companyDocsVerified: { type: Boolean, default: false } // for any company identity proof
    },
    verifiedAt: { type: Date, default: null }
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String, required: true },
        location: { type: String },
        role: {
            type: String,
            enum: ["job_seeker", "recruiter", "admin"],
            required: true
        },
        skills: [{ type: String }],
        experienceLevel: { type: String },

        // Sub-documents
        jobSeekerProfile: {
            type: jobSeekerProfileSchema,
            default: undefined
        },
        recruiterProfile: {
            type: recruiterProfileSchema,
            default: undefined
        },

        // System Fields
        isGeneratedByAI: { type: Boolean, default: false },
        lastSignInTime: { type: Date }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
