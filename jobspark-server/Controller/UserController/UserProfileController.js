const UserModel = require("../../Model/AccountModel/UserModel");
const mongoose = require("mongoose");
const AdminNotificationModel = require("../../Model/NotificatonModel/AdminNotificationModel");

/**
 * *Retrieves a user's profile information by their ID.
 *  input ulr = /api/v1/users/:id
 *  
 *  Req - get
 * 
 * @async
 * @function getProfileInfo
 * @param {import('express').Request} req - Express request object, expects `id` parameter in `req.params`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the user profile (excluding password) or an error message.
 *
 * @throws {400} If the provided user ID is not a valid MongoDB ObjectId.
 * @throws {404} If the user is not found.
 * @throws {500} If a server error occurs during the process.
 */
const getProfileInfo = async (req, res) => {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid user ID." });
    }

    try {
        const user = await UserModel.findById(id).select("-password"); // Exclude password field
        console.log("USER ", user);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Server error." });
    }
}

// patch - /jobSeekerId/update-profile
const updateProfile = async (req, res) => {
    try {
        const { jobSeekerId } = req.params;

        // Accept nested or flat update:
        const updateData = req.body.jobSeekerProfile || req.body;

        // Find user first
        const existingJobSeeker = await UserModel.findById(jobSeekerId);
        if (!existingJobSeeker) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const wasVerified = existingJobSeeker.jobSeekerProfile?.isVerified || false;

        // If jobSeekerProfile undefined, initialize it as empty object
        const currentProfile = existingJobSeeker.jobSeekerProfile
            ? existingJobSeeker.jobSeekerProfile.toObject()
            : {};

        // Merge existing profile with updateData
        const newProfile = { ...currentProfile, ...updateData };

        // Update only jobSeekerProfile subdocument
        const updatedUser = await UserModel.findByIdAndUpdate(
            jobSeekerId,
            { $set: { jobSeekerProfile: newProfile } },
            { new: true, runValidators: true }
        );

        const isNowVerified = updatedUser.jobSeekerProfile?.isVerified || false;

        if (!wasVerified && isNowVerified) {
            await AdminNotificationModel.create({
                message: `Job Seeker ${updatedUser.name} (ID: ${updatedUser._id}) has been verified.`,
                recipientId: null, // add admin IDs if needed
                senderId: updatedUser._id,
                status: "sent",
                type: "profile_verified",
                occurrences: 1,
            });
        }

        return res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getProfileInfo, updateProfile }