/**
 * Goal - sending values in the body of the request to create a company profile
 * 
 * input url - /api/company/create
 * input method - POST
 */

const CompanyModel = require("../../Model/CompanyModel/CompanyModel");

// Make sure you have CompanyModel imported, e.g.:
// const CompanyModel = require('../models/CompanyProfile'); // Adjust path as needed

const createCompanyProfile = async (req, res) => {
    const companyData = req.body; // Correctly get the body directly

    console.log("Body received for creating company profile:", companyData);

    // --- Start of Manual/Early Validation Checks for ALL fields ---

    // Basic Company Info
    if (!companyData.companyName || typeof companyData.companyName !== "string" || companyData.companyName.trim().length === 0) {
        return res.status(400).json({ error: "Company name is required and must be a non-empty string." });
    }
    if (companyData.companyName.trim().length > 100) {
        return res.status(400).json({ error: "Company name cannot exceed 100 characters." });
    }

    if (!companyData.email || typeof companyData.email !== "string" || !/\S+@\S+\.\S+/.test(companyData.email)) {
        return res.status(400).json({ error: "A valid company email is required." });
    }
    // Mongoose's unique validator will handle uniqueness, but a basic type/format check is here

    if (companyData.tagline && (typeof companyData.tagline !== "string" || companyData.tagline.trim().length > 200)) {
        return res.status(400).json({ error: "Tagline must be a string and not exceed 200 characters." });
    }

    if (companyData.website && (typeof companyData.website !== "string" || !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(companyData.website))) {
        return res.status(400).json({ error: "Please provide a valid website URL." });
    }

    // const currentYear = new Date().getFullYear();
    // if (companyData.foundedYear !== undefined) {
    //     if (typeof companyData.foundedYear !== "number") {
    //         return res.status(400).json({ error: `Founded year must be a number ${currentYear}.` });
    //     }
    // }

    if (companyData.phone && (typeof companyData.phone !== "string" || companyData.phone.trim().length > 20)) {
        return res.status(400).json({ error: "Phone number must be a string and not exceed 20 characters." });
    }

    // Logo validation - usually handled after file upload
    // if (companyData.logo && typeof companyData.logo !== "string") {
    //     return res.status(400).json({ error: "Logo must be a string (URL to image)." });
    // }


    // Company Details
    const allowedIndustries = ["Software", "Hybrid", "On-site", "Manufacturing", "Finance", "Healthcare", "Education", "Retail", "Other"];
    if (!companyData.industry || typeof companyData.industry !== "string" || !allowedIndustries.includes(companyData.industry)) {
        return res.status(400).json({ error: `A valid industry is required. Allowed values are: ${allowedIndustries.join(', ')}.` });
    }

    if (!companyData.headquarters || typeof companyData.headquarters !== "string" || companyData.headquarters.trim().length === 0) {
        return res.status(400).json({ error: "Headquarters location is required and must be a non-empty string." });
    }
    if (companyData.headquarters.trim().length > 100) {
        return res.status(400).json({ error: "Headquarters cannot exceed 100 characters." });
    }

    if (companyData.description && (typeof companyData.description !== "string" || companyData.description.trim().length > 1000)) {
        return res.status(400).json({ error: "Description must be a string and not exceed 1000 characters." });
    }

    if (companyData.workingHours && (typeof companyData.workingHours !== "string" || companyData.workingHours.trim().length > 100)) {
        return res.status(400).json({ error: "Working hours must be a string and not exceed 100 characters." });
    }

    const allowedWorkTypes = ["Remote", "Hybrid", "On-site"];
    if (companyData.workType && (typeof companyData.workType !== "string" || !allowedWorkTypes.includes(companyData.workType))) {
        return res.status(400).json({ error: `Invalid work type. Allowed values are: ${allowedWorkTypes.join(', ')}.` });
    }

    const allowedCompanySizes = ["1-10", "11-50", "51-200", "201-500", "500+"];
    if (companyData.companySize && (typeof companyData.companySize !== "string" || !allowedCompanySizes.includes(companyData.companySize))) {
        return res.status(400).json({ error: `Invalid company size. Allowed values are: ${allowedCompanySizes.join(', ')}.` });
    }

    const allowedCompanyTypes = ["Startup", "SME", "Enterprise", "NGO", "Government", "Other"];
    if (companyData.companyType && (typeof companyData.companyType !== "string" || !allowedCompanyTypes.includes(companyData.companyType))) {
        return res.status(400).json({ error: `Invalid company type. Allowed values are: ${allowedCompanyTypes.join(', ')}.` });
    }

    if (companyData.companyValues && (typeof companyData.companyValues !== "string" || companyData.companyValues.trim().length > 500)) {
        return res.status(400).json({ error: "Company values must be a string and not exceed 500 characters." });
    }

    if (companyData.certifications && (typeof companyData.certifications !== "string" || companyData.certifications.trim().length > 300)) {
        return res.status(400).json({ error: "Certifications must be a string and not exceed 300 characters." });
    }


    // Social & Media Links

    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    if (companyData.facebook) {
        if (typeof companyData.facebook !== "string" || !urlRegex.test(companyData.facebook)) {
            return res.status(400).json({ error: "Please provide a valid Facebook URL." });
        }
    }
    if (companyData.instagram) {
        if (typeof companyData.instagram !== "string" || !urlRegex.test(companyData.instagram)) {
            return res.status(400).json({ error: "Please provide a valid Instagram URL." });
        }
    }
    if (companyData.x) {
        if (typeof companyData.x !== "string" || !urlRegex.test(companyData.x)) {
            return res.status(400).json({ error: "Please provide a valid X (Twitter) URL." });
        }
    }
    if (companyData.whatsapp) {
        // WhatsApp link regex can be tricky, this is a basic URL check.
        // Mongoose schema has a more specific one.
        if (typeof companyData.whatsapp !== "string" || !urlRegex.test(companyData.whatsapp)) {
            return res.status(400).json({ error: "Please provide a valid WhatsApp link." });
        }
    }
    if (companyData.linkedin) {
        if (typeof companyData.linkedin !== "string" || !urlRegex.test(companyData.linkedin)) {
            return res.status(400).json({ error: "Please provide a valid LinkedIn URL." });
        }
    }

    try {
        const response = new CompanyModel(companyData);
        const result = await response.save(); // Mongoose validation runs here as a secondary check

        console.log("Result from saving company profile:", result);
        res.status(201).json({
            success: true,
            message: "Company profile created successfully!",
            data: result
        });
    } catch (error) {
        console.error("Error creating company profile:", error);
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ success: false, message: "Validation failed", errors });
        } else if (error.code === 11000) {
            // This is for unique index errors (like duplicate email)
            return res.status(409).json({ success: false, message: "A company with this email already exists.", error: error.message });
        }
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

module.exports = { createCompanyProfile }