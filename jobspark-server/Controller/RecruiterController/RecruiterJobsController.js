const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

//!show recruiter posted jobs.
// /http://localhost:5000/api/v1/job/recruiter
const showRecuiterJobs = async (req, res) => {
    try {
        const result = await ActiveJobsModel.find();
        if (!result) {
            res.status(404).json({
                status: false,
                message: "No jobs posted by recruiter",
            })
        }
        res.status(200).json({
            status: true,
            message: "Jobs posted by recruiter",
            data: result,
        });
    } catch (err) {
        console.log("/n error from showRecuiterJobs : ", err.message);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        })
    }
}

module.exports = { showRecuiterJobs }