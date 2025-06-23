const mongoose = require("mongoose");
const CompanyModel = require("../../Model/CompanyModel/CompanyModel");
const NotificationModel = require("../../Model/NotificatonModel/NotificationModel");

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

module.exports = { createCompanyProfile };
