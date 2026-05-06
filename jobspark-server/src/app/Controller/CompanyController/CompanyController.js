const mongoose = require("mongoose");
const CompanyModel = require("../../Model/CompanyModel/CompanyModel");
const NotificationModel = require("../../Model/NotificatonModel/NotificationModel");
const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");
const JobApplicationModel = require("../../Model/JobApplicationModel/JobApplicationModel");


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
 * input url -POST /api/v1/recruiter/:recruiterId/company/create

 * Req - post
 * 
 * @async
 * @function createCompanyProfile
 * @param {import('express').Request} req - Express request object containing company data in `body`.
 * @param {import('express').Response} res - Express response object used to send the result.
 * @returns {Promise<void>} Sends a JSON response with the operation result.
 */
const createCompanyProfile = async (req, res) => {
    const { recruiterId } = req.params;
    console.log("Recruiter ID from URL:", recruiterId);

    const companyData = req.body;

    try {
        if (!companyData) {
            return res.status(400).json({ success: false, message: "Company data is required." });
        }

        // ✅ Validate recruiterId from params
        if (!recruiterId || !mongoose.Types.ObjectId.isValid(recruiterId)) {
            return res.status(400).json({ success: false, message: "Invalid or missing recruiterId in URL." });
        }

        // ✅ Attach recruiterId to the company data
        const newCompany = new CompanyModel({
            ...companyData,
            recruiterId: recruiterId
        });

        const savedCompany = await newCompany.save();

        try {
            // ✅ Create notification
            await NotificationModel.create({
                userId: new mongoose.Types.ObjectId(recruiterId),
                message: `Company profile '${companyData.companyName}' created successfully.`,
                type: "company",
                isRead: false
            });

            return res.status(201).json({
                success: true,
                message: "Company profile created successfully!",
                data: savedCompany
            });

        } catch (notificationError) {
            // Rollback
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

        console.log("Companiens", companies);
        console.log("length ", companies.length);

        // Success response
        return res.status(200).json({
            success: true,
            message: "Companies retrieved successfully.",
            data: companies,
            size: companies.length
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


/**
 * *Retrieves a company by its ID.
 * 
 * input url - http://localhost:5000/api/v1/company/:companyId
 * 
 * Req - Get
 *
 * @async
 * @function findCompanyById
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the company data or an error message.
 */
const findCompanyById = async (req, res) => {
    const { companyId } = req.params;

    // Validate companyId
    if (!companyId || !mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing companyId."
        });
    }

    try {
        const company = await CompanyModel.findById(companyId);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Company retrieved successfully.",
            data: company
        });
    } catch (error) {
        console.error("❌ Error fetching company by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

/**
 * Retrieves a company's profile along with all jobs posted by the associated recruiter.
 *
 * @async
 * @function getCompanyProfileWithJobs
 * @param {import('express').Request} req - Express request object, expects `recruiterId` and `companyId` in `req.params`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with company profile, jobs, and job count, or an error message.
 *
 * @throws {404} If the company is not found.
 * @throws {403} If the recruiter ID does not match the company's recruiter.
 * @throws {500} If a server error occurs.
 */
const getCompanyProfileWithJobs = async (req, res) => {
    try {
        const { recruiterId, companyId } = req.params;

        // Find company by ID
        const company = await CompanyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        // Verify recruiter ID matches the one on company profile
        if (company.recruiter.toString() !== recruiterId) {
            return res.status(403).json({ success: false, message: "Recruiter ID mismatch" });
        }

        // Find jobs posted by this recruiter
        const jobs = await ActiveJobsModel.find({ recruiter: recruiterId });

        res.status(200).json({
            success: true,
            company,
            jobs,
            jobCount: jobs.length
        });
    } catch (error) {
        console.error("Error fetching company profile with jobs:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// /GET http://localhost:5000/api/v1/recruiter/:recruiterId/company/:companyId/job-details

/**
 * Retrieves job details for a specific job posted by a recruiter within a company.
 * 
 * input url -  http://localhost:5000/api/v1/recruiter/:recruiterId/company/:companyId/job/:jobId
 * 
 * req - get
 * 
 * @async
 * @function companyJobDetailsByRecruiter
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.recruiterId - The ID of the recruiter.
 * @param {string} req.params.companyId - The ID of the company.
 * @param {string} req.params.jobId - The ID of the job.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with job details or an error message.
 *
 * @throws {400} If any required parameter is missing.
 * @throws {404} If the company or job is not found or does not belong to the recruiter.
 * @throws {500} If a server error occurs.
 */
const companyJobDetailsByRecruiter = async (req, res) => {

    const { recruiterId, companyId, jobId } = req.params;

    if (!recruiterId || !companyId || !jobId) {
        return res.status(400).json({ success: false, message: "All parameters are required." });
    }

    try {
        // Optional: Validate company ownership
        const company = await CompanyModel.findOne({ _id: companyId, recruiter: recruiterId });

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found or does not belong to recruiter." });
        }

        // Find job posted by this recruiter
        const job = await ActiveJobsModel.findOne({ _id: jobId, recruiter: recruiterId });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found or does not belong to recruiter." });
        }

        return res.status(200).json({ success: true, data: job });

    } catch (err) {
        console.error("Error fetching job:", err.message);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};



module.exports = { createCompanyProfile, getAllCompanies, findCompanyById, getCompanyProfileWithJobs, companyJobDetailsByRecruiter };
