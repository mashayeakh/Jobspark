const mongoose = require("mongoose");
const CompanyModel = require("../../Model/CompanyModel/CompanyModel");
const NotificationModel = require("../../Model/NotificatonModel/NotificationModel");


/**
 * * Creates a new company profile and a notification for the recruiter.
 * 
 * This controller function expects company data in the request body, including a valid `recruiterId`.
 * It performs the following steps within a MongoDB transaction:
 *   1. Validates the presence and format of `recruiterId`.
 *   2. Saves the new company profile to the database.
 *   3. Creates a notification for the recruiter about the successful creation.
 *   4. Rolls back the transaction if notification creation fails.
 * 
 * Handles validation errors, duplicate email errors, and general server errors.
 * 
 * input url - http://localhost:5000/api/v1/company/create
 * 
 * Req - post
 * 
 * @async
 * @function createCompanyProfile
 * @param {import('express').Request} req - Express request object containing company data in `body`.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @returns {Promise<void>} Sends a JSON response with the operation result.
 */

const createCompanyProfile = async (req, res) => {
    const companyData = req.body;

    try {
        if (!companyData) {
            return res.status(400).json({ success: false, message: "Company data is required." });
        }

        // Log recruiterId to confirm it's received
        console.log("Recruiter ID provided:", companyData.recruiterId);

        // Validate recruiterId format
        if (!companyData.recruiterId || !mongoose.Types.ObjectId.isValid(companyData.recruiterId)) {
            return res.status(400).json({ success: false, message: "Invalid or missing recruiterId." });
        }

        // Step 1: Save the company
        const newCompany = new CompanyModel(companyData);
        const savedCompany = await newCompany.save();

        try {
            // Step 2: Create notification with explicit ObjectId cast
            await NotificationModel.create({
                // userId: mongoose.Types.ObjectId(companyData.recruiterId),
                userId: new mongoose.Types.ObjectId(companyData.recruiterId),
                message: `Company profile '${companyData.companyName}' created successfully.`,
                type: "company",
                isRead: false
            });

            // Step 3: Return success
            return res.status(201).json({
                success: true,
                message: "Company profile created successfully!",
                data: savedCompany
            });

        } catch (notificationError) {
            // Rollback company creation on notification failure
            await CompanyModel.findByIdAndDelete(savedCompany._id);
            console.error("❌ Notification creation failed. Company rolled back.", notificationError);
            return res.status(500).json({
                success: false,
                message: "Failed to create notification. Company profile was not saved.",
                error: notificationError.message
            });
        }

    } catch (error) {
        console.error("❌ Error creating company profile:", error);
        if (error.name === 'ValidationError') {
            const errors = {};
            for (const field in error.errors) {
                errors[field] = error.errors[field].message;
            }
            return res.status(400).json({ success: false, message: "Validation failed", errors });
        } else if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A company with this email already exists." });
        }
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

/**
 * 
 * * Retrieves all companies from the database.
 * 
 *  input url - http://localhost:5000/api/v1/companies
 * 
 *  Req - Get
 *
 * @async
 * @function getAllCompanies
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the list of companies or an error message.
 */
const getAllCompanies = async (req, res) => {
    try {
        // Optionally, add query validation here if you expect query params

        const companies = await CompanyModel.find();

        // If no companies found, return a message (optional)
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No companies found."
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: "Companies retrieved successfully.",
            data: companies
        });
    } catch (error) {
        console.error("❌ Error fetching companies:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};








module.exports = { createCompanyProfile, getAllCompanies };
