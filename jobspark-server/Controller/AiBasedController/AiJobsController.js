const UserModel = require("../../Model/AccountModel/UserModel");
const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

const { getRecommendedUsers } = require("../../Utils/gemini");

// GET /recommend-jobs/:userId
const aiRecommendJobs = async (req, res) => {
    try {
        const { userId } = req.params;

        // 🧑 Fetch user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 💼 Fetch ongoing jobs
        const jobs = await ActiveJobsModel.find({ status: "ongoing" });

        // 🧹 Clean user profile
        const userProfile = {
            location: user.location,
            experienceLevel: user.experienceLevel,
            skills: user.skills[0]?.split(",").map(s => s.trim()) || [],
            preferredLocations: user?.jobSeekerProfile?.preferredLocations || [],
            preferredJobTitle: user?.jobSeekerProfile?.preferredJobTitle || "",
        };

        // 🧹 Clean job list
        const jobList = jobs.map(job => ({
            id: job._id,
            title: job.jobTitle,
            location: job.location,
            experience: job.experienceLevel,
            skills: job.skills.split(',').map(skill => skill.trim()),
            salary: job.salary,
        }));

        // 🧠 AI Prompt
        const prompt = `
You are a helpful AI that recommends jobs to users based on their profile.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

AVAILABLE JOBS:
${JSON.stringify(jobList, null, 2)}

TASK:
- Match the user's skills, experience level, and location preferences to the available jobs.
- If perfect matches are not found, find the most closely related jobs.
- Ignore location mismatch if skill and experience are highly relevant.
- Always return the TOP 3 closest matching jobs based on relevance.
- Return ONLY an array of job IDs like: ["jobId1", "jobId2", "jobId3"]
- DO NOT return any explanation or extra text. Only the raw array.
`;

        // 🔁 Call Gemini
        let recommendationTxt;
        try {
            recommendationTxt = await getRecommendedUsers(prompt);
        } catch (geminiError) {
            // Handle quota errors
            if (geminiError.message.includes("429") || geminiError.message.includes("quota")) {
                return res.status(429).json({
                    success: false,
                    message: "Gemini API quota exceeded. Please try again later.",
                });
            }

            // Other Gemini-related issues
            return res.status(500).json({
                success: false,
                message: "Error while calling Gemini",
                details: geminiError.message,
            });
        }

        // 🧾 Extract array
        const match = recommendationTxt.match(/\[[^\]]*\]/);
        if (!match) {
            return res.status(500).json({
                success: false,
                message: "Gemini did not return a valid job ID array",
                raw: recommendationTxt,
            });
        }

        let jobIds;
        try {
            jobIds = JSON.parse(match[0]);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to parse Gemini's job IDs",
                raw: match[0],
            });
        }

        // 🧐 If empty
        if (!jobIds || jobIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No matching jobs found",
                jobs: [],
            });
        }

        // ✅ Fetch matching jobs
        const recommendedJobs = await ActiveJobsModel.find({ _id: { $in: jobIds } });

        return res.status(200).json({
            success: true,
            message: "Recommended jobs found",
            length: recommendedJobs.length,
            jobs: recommendedJobs,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "🔥 Something went wrong while generating job recommendations",
            details: error.message,
        });
    }
};

module.exports = { aiRecommendJobs };
