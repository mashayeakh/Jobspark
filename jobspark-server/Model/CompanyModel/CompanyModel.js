const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema({
    // Basic Company Info


    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Change this to "Recruiter" if you have a dedicated recruiter model
        required: true
    },

    companyName: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
        maxlength: [100, "Company name cannot exceed 100 characters"]
    },
    email: {
        type: String,
        required: [true, "Company email is required"],
        unique: true, // Assuming each company has a unique email
        trim: true,
        lowercase: true, // Store emails in lowercase for consistency
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'] // Basic email validation
    },
    tagline: {
        type: String,
        trim: true,
        maxlength: [200, "Tagline cannot exceed 200 characters"]
    },
    website: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please use a valid URL'] // Basic URL validation
    },
    foundedYear: {
        type: Number, // Store as a number
        min: [1000, "Founded year must be a valid year"], // Assuming a minimum year
        max: [new Date().getFullYear(), "Founded year cannot be in the future"] // Cannot be in the future
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, "Phone number cannot exceed 20 characters"]
    },
    // logo: {
    //     type: String, // Store URL to the logo image (after upload to a storage service)
    //     // You might want to add a default image URL here if no logo is provided
    // },

    // Company Details
    industry: {
        type: String,
        required: [true, "Industry is required"],
        enum: ["Software", "Hybrid", "On-site", "Manufacturing", "Finance", "Healthcare", "Education", "Retail", "Other"], // Add more as needed
    },
    headquarters: { // Renamed from mainLoaction for clarity/consistency
        type: String,
        required: [true, "Headquarters location is required"],
        trim: true,
        maxlength: [100, "Headquarters cannot exceed 100 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"]
    },
    workingHours: {
        type: String,
        trim: true,
        maxlength: [100, "Working hours cannot exceed 100 characters"]
    },
    workType: {
        type: String,
        enum: ["Remote", "Hybrid", "On-site"],
        default: "On-site"
    },
    companySize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
    },
    companyType: {
        type: String,
        enum: ["Startup", "SME", "Enterprise", "NGO", "Government", "Other"],
    },
    companyValues: {
        type: String,
        trim: true,
        maxlength: [500, "Company values cannot exceed 500 characters"]
    },
    certifications: {
        type: String,
        trim: true,
        maxlength: [300, "Certifications cannot exceed 300 characters"]
    },

    // Social & Media Links
    facebook: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?(www\.)?facebook\.com\/.+$/, 'Please use a valid Facebook URL']
    },
    instagram: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?(www\.)?instagram\.com\/.+$/, 'Please use a valid Instagram URL']
    },
    x: { // Formerly Twitter
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?(www\.)?x\.com\/.+$/, 'Please use a valid X (Twitter) URL']
    },
    whatsapp: {
        type: String,
        trim: true,
        // For WhatsApp, it's often a phone number or a wa.me link. Adjust regex as needed.
        match: [/^(https?:\/\/)?(www\.)?(wa\.me\/|api\.whatsapp\.com\/send\?phone=)([0-9]{1,15})/, 'Please use a valid WhatsApp link/number']
    },
    linkedin: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/.+$/, 'Please use a valid LinkedIn URL']
    },
    gmail: { // This might be redundant if 'email' covers it, but kept based on your frontend
        type: String,
        trim: true,
        match: [/\S+@gmail\.com$/, 'Please use a valid Gmail address']
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the `updatedAt` field on every save
companyProfileSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("CompanyProfile", companyProfileSchema);