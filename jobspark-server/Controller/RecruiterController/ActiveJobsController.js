const activeJobsModel = require("../../Model/Recruiter/ActiveJobs");


const createActiveJobs = async (req, res) => {
    try {
        const allJobsData = req.body;

        console.log("All jobs ", allJobsData);

        const newJobs = new activeJobsModel(allJobsData);

        const resultantJobs = await newJobs.save();
        res.status(201).json({
            message: "Active Jobs are created successfully",
            success: true,
            data: resultantJobs
        });

    } catch (err) {
        console.log("Err occured", err);
    }
}

module.exports = { createActiveJobs }