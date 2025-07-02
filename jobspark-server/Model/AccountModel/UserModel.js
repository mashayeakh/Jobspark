// const { default: mongoose, Mongoose } = require("mongoose");

// const userSchema = mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true,
//         min: 4,
//         max: 10,
//     },
//     email: {
//         type: String, // should be String, not 'email'
//         required: true,
//         trim: true,
//         unique: true,
//         lowercase: true,
//         match: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
//     },
//     location: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     university: {
//         type: String,
//         required: true,
//         trim: true,
//         required: function () {
//             return this.role === 'job_seeker';
//         },
//     },
//     roles: {
//         type: String,
//         required: true,
//         trim: true,
//         required: function () {
//             return this.role === 'job_seeker';
//         },
//     },
//     skills: {
//         type: [String],
//         required: function () {
//             return this.role === 'job_seeker';
//         },
//         trim: true,
//     },
//     experienceLevel: {
//         type: String,
//         required: true,
//         trim: true,
//         required: function () {
//             return this.role === 'job_seeker';
//         },
//     },
//     phone: {
//         type: String,
//         required: true,
//         trim: true,
//         match: /^[0-9]{10,15}$/, // adjust regex as needed for your requirements
//         required: function () {
//             return this.role === "recruiter";
//         }
//     },
//     role: {
//         type: String,
//         enum: ['admin', 'recruiter', 'job_seeker'],
//         default: 'job_seeker'
//     },
//     phoneNumber: {
//         type: String,
//         // required: true,
//         default: ""
//     },
//     bio: {
//         bio: String,
//         default: "",
//     },
//     profileImage: {
//         type: String,
//         default: "",
//     },

//     education: {
//         university: { type: String, default: "" },
//         degree: { type: String, default: "" },
//         fieldOfStudy: { type: String, default: "" },
//         graduationYear: { type: String, default: "" }
//     },

//     preferredJobTitles: {
//         type: [String], default: []
//     },
//     preferredLocations: {
//         type: [String], default: []
//     },
//     socialLinks: {
//         linkedin: { type: String, default: "" },
//         github: { type: String, default: "" },
//         portfolio: { type: String, default: "" }
//     },
//     resume: {
//         type: String,
//         default: ""
//     },
//     certificates: {
//         type: [String],
//         default: []
//     },


//     // these two are for recruiters only
//     company_role: {
//         type: String,
//         enum: ['hr', 'hiring_manager', 'other'],
//         required: function () {
//             return this.role === "recruiter";
//         },
//         trim: true,
//     },
//     website: {
//         type: String,
//         required: function () {
//             return this.role === "recruiter";
//         },
//         trim: true,
//     },
//     appliedApplicationCount: {
//         type: Number,
//         default: 0,
//         select: false, //hides for normal find()
//     },
//     appliedJobIds: {
//         type: [mongoose.Schema.Types.ObjectId],
//         ref: "ActiveJob",
//         default: [],
//         select: false, //hides for normal find()
//     },
//     lastSignInTime: {
//         type: Date,
//         default: null,
//     },
//     isProfileComplete: {
//         type: Boolean, default: false
//     },

// })


const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    // Common fields for all users
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'recruiter', 'job_seeker'],
        default: 'job_seeker',
    },

    skills: {
        type: [String],
        required: function () {
            return this.role === 'job_seeker';
        },
        trim: true,
    },
    experienceLevel: {
        type: String,
        required: true,
        trim: true,
        required: function () {
            return this.role === 'job_seeker';
        },
    },
    // Job Seeker specific fields
    jobSeekerProfile: {
        university: { type: String, default: "" },
        roles: { type: String, default: "" }, // e.g. Junior Software Engineer
        // experienceLevel: { type: String, default: "" },
        phoneNumber: { type: String, default: "" },

        bio: { type: String, default: "" },
        profileImage: { type: String, default: "" },

        education: {
            university: { type: String, default: "" },
            degree: { type: String, default: "" },
            fieldOfStudy: { type: String, default: "" },
            graduationYear: { type: String, default: "" },
        },

        preferredJobTitles: { type: [String], default: [] },
        preferredLocations: { type: [String], default: [] },

        socialLinks: {
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            portfolio: { type: String, default: "" },
        },

        resume: { type: String, default: "" },
        certificates: { type: [String], default: [] },

        isProfileComplete: { type: Boolean, default: false },
    },

    // Recruiter specific fields
    recruiterProfile: {
        phone: {
            type: String,
            trim: true,
            match: /^[0-9]{10,15}$/,
            required: function () {
                return this.role === "recruiter";
            },
        },
        company_role: {
            type: String,
            enum: ['hr', 'hiring_manager', 'other'],
            trim: true,
            required: function () {
                return this.role === "recruiter";
            },
        },
        website: {
            type: String,
            trim: true,
            required: function () {
                return this.role === "recruiter";
            },
        },
    },

    // Shared fields
    appliedApplicationCount: {
        type: Number,
        default: 0,
        select: false,
    },
    appliedJobIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ActiveJob",
        default: [],
        select: false,
    },
    lastSignInTime: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model("User", userSchema);
