const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

//!show recruiter posted jobs. 
const showRecuiterJobs = async (req, res) => {
    //get the recruiter id

    try {
        const recruiter_id = req.query.recruiterId;
        console.log("Recruiter id ", recruiter_id);


        if (!recruiter_id) {
            return res.status(400).json({
                status: "error",
                message: "Please provide recruiter id",
            });
        }


        //get the job model
        const activeJobs = await ActiveJobsModel.find({
            recruiter: recruiter_id,
        })

        if (!activeJobs || activeJobs.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No jobs found",
            });
        }


        res.status(200).json({
            status: "success",
            message: "Found",
            data: activeJobs
        })


    } catch (err) {
        console.log("Err from backlend", err.message);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        })
    }


    // res.send(recruiter_id);
}

module.exports = { showRecuiterJobs }