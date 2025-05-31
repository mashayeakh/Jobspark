const UserModel = require("../../Model/AccountModel/UserModel");
const JobApplicationModel = require("../../Model/JobApplicationModel/JobApplicationModel");
const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

const mongoose = require('mongoose');

//has user applied to job
//http://localhost:5000/api/v1/check-application?userId=${useId}&jobId=${jobId}
const hasUserApplied = async (req, res) => {
    const { userId, jobId } = req.query;

    try {
        console.log("User Id , Job Id", userId, jobId);

        const userObjectId = new mongoose.Types.ObjectId(userId);
        const jobObjectId = new mongoose.Types.ObjectId(jobId);

        const userInfo = await UserModel.findById(userObjectId);
        const jobInfo = await ActiveJobsModel.findById(jobObjectId);


        const allApplications = await JobApplicationModel.find({});
        console.log("All Applications in DB:", allApplications);


        const existingApplication = await JobApplicationModel.findOne({
            job: jobObjectId,
            user: userObjectId
        });

        console.log("Existed Application", existingApplication);

        if (existingApplication) {
            return res.status(200).json({ success: true, applied: true });
        } else {
            return res.status(200).json({ success: true, applied: false });
        }
    } catch (error) {
        console.error("Error in hasUserApplied:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


module.exports = { hasUserApplied }