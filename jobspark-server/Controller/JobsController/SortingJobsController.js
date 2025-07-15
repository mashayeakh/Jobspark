const { application } = require("express");
const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");
const UserModel = require("../../Model/AccountModel/UserModel");
const SavedJobsModel = require("../../Model/JobsModel/SavedJobsModel");

//http://localhost:5000/api/v1/hotJobs - get Req
const getHotJobs = async (req, res) => {
    try {
        // Validation: No input to validate for this endpoint, but you can add checks if needed

        const today = new Date();

        const hotJobs = await ActiveJobsModel.find({
            status: "ongoing",
            applicantsCount: { $gte: 1 },
        }).sort({
            applicantsCount: -1,
            salary: -1,
        })
            .limit(10);

        console.log("Hot jobs ", hotJobs);
        console.log("Hot jobs length", hotJobs.length);

        return res.status(200).json({
            success: true,
            data: hotJobs,
            count: hotJobs.length,
            message: "Hot jobs fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching hot jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


//req - post => api/v1/user/:userId/save-jobs/:jobId
const savedJobs = async (req, res) => {
    try {
        const { userId, jobId } = req.params;
        if (!userId || !jobId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Job ID are required"
            });
        }

        // Check if job exists
        const job = await ActiveJobsModel.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if job is already saved by user
        const alreadySaved = await SavedJobsModel.findOne({ userId, jobId });
        if (alreadySaved) {
            return res.status(200).json({
                success: false,
                message: "Job already saved"
            });
        }

        const savedJob = new SavedJobsModel({ userId, jobId });
        const savedJobDoc = await savedJob.save();

        return res.status(201).json({
            success: true,
            data: savedJobDoc,
            message: "Job saved successfully"
        });
    } catch (error) {
        console.error("Error saving job:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

//get saved jobs
//req- get => api/v1/user/:userId/saved-jobs
// GET api/v1/user/:userId/saved-jobs
const getSavedJobs = async (req, res) => {
    try {
        // Validate userId parameter
        const { userId } = req.params;
        // Check if userId is provided
        if (!userId) {
            return res.status(400).send({ message: 'User  ID is required' });
        }
        // Validate userId format (assuming it's a MongoDB ObjectId)
        if (typeof userId !== 'string' || !/^[a-f\d]{24}$/i.test(userId)) {
            return res.status(400).send({ message: 'Invalid User ID format' });
        }
        console.log(`User  ID: ${userId}`);
        // Find saved jobs
        const savedJobs = await SavedJobsModel.find({ userId });
        console.log(`Saved Jobs: ${savedJobs.length} found`);
        // Return saved jobs or error message
        if (savedJobs.length === 0) {
            return res.status(404).send(
                {
                    message: 'No saved jobs found'
                }
            );
        }
        // Return the list of saved jobs
        return res.status(200).send(
            {
                success: true,
                data: savedJobs,
                count: savedJobs.length
            }
        );
    } catch (error) {
        console.error('Error fetching saved jobs:', error);
        return res.status(500).send(
            {
                success: false,
                message: 'Internal Server Error'
            }
        );
    }
};



module.exports = {
    getHotJobs,
    savedJobs,
    getSavedJobs,
}