

/**
 * *Searches for jobs based on query parameters: keyword, location, and category.
 *  jobs/search?keyword=software&location=Dhaka&category=Software%20%Developement

 * @async
 * @function searchJobs
 * @param {import('express').Request} req - Express request object containing query parameters:
 *   @param {string} [req.query.keyword] - Keyword to search in job title, description, or skills.
 *   @param {string} [req.query.location] - Location to filter jobs.
 *   @param {string} [req.query.category] - Job category to filter jobs.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the search results or an error message.
 */
//Query params

const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

// /api/v1/jobs/search?keyword=software&location=Dhaka&category=Software%20%Developement
const searchJobs = async (req, res) => {
    try {
        const { keyword, location, category } = req.query;

        // Basic validation
        if (
            (keyword && typeof keyword !== "string") ||
            (location && typeof location !== "string") ||
            (category && typeof category !== "string")
        ) {
            return res.status(400).json({ success: false, message: "Invalid query parameters" });
        }

        const query = {};

        if (keyword) {
            query.$or = [
                { jobTitle: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { skills: { $regex: keyword, $options: "i" } },
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (category) {
            query.jobCategory = { $regex: category, $options: "i" };
        }

        const jobs = await ActiveJobsModel.find(query);
        res.status(200).json({ success: true, data: jobs });
    } catch (err) {
        res.status(500).json({ success: false, message: "Search failed", error: err.message });
    }
};

module.exports = { searchJobs }