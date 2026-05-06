//num of applicants per job
// req - get; /recruiter/:recruiterId/job-wise-applications

const { default: mongoose } = require("mongoose");
const RecruiterActivityModel = require("../../Model/RecruiterModel/RecruiterActivityModel");

const getApplicationsPerJobs = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        if (!recruiterId) {
            return res.status(400).json({ success: false, message: 'Recruiter ID is required' });
        }

        const result = await RecruiterActivityModel.aggregate([
            {
                $match: {
                    recruiter: new mongoose.Types.ObjectId(recruiterId)
                }
            },
            {
                $lookup: {
                    from: "activejobs", // ✅ FIXED: Use the correct collection name
                    localField: "job",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" },
            {
                $group: {
                    _id: "$jobDetails.jobTitle",
                    applicants: { $sum: 1 }
                }
            },
            {
                $project: {
                    job: "$_id",
                    applicants: 1,
                    _id: 0
                }
            }
        ]);



        return res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error('Error fetching applications per job:', error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }

}

module.exports = { getApplicationsPerJobs }