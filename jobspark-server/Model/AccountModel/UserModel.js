const { default: mongoose, Mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 4,
        max: 10,
    },
    email: {
        type: String, // should be String, not 'email'
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    university: {
        type: String,
        required: true,
        trim: true,
        required: function () {
            return this.role === 'job_seeker';
        },
    },
    roles: {
        type: String,
        required: true,
        trim: true,
        required: function () {
            return this.role === 'job_seeker';
        },
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
    phone: {
        type: String,
        required: true,
        trim: true,
        match: /^[0-9]{10,15}$/, // adjust regex as needed for your requirements
        required: function () {
            return this.role === "recruiter";
        }
    },
    role: {
        type: String,
        enum: ['admin', 'recruiter', 'job_seeker'],
        default: 'job_seeker'
    },

    // these two are for recruiters only
    company_role: {
        type: String,
        enum: ['hr', 'hiring_manager', 'other'],
        required: function () {
            return this.role === "recruiter";
        },
        trim: true,
    },
    website: {
        type: String,
        required: function () {
            return this.role === "recruiter";
        },
        trim: true,
    },
    appliedApplicationCount: {
        type: Number,
        default: 0,
        select: false, //hides for normal find()
    },
    appliedJobIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "ActiveJob",
        default: [],
        select: false, //hides for normal find()
    },
    lastSignInTime: {
        type: Date,
        default: null,
    }

})

module.exports = mongoose.model("User", userSchema);