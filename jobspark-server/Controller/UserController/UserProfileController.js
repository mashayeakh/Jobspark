const UserModel = require("../../Model/AccountModel/UserModel");
const mongoose = require("mongoose");

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

module.exports = { getProfileInfo }