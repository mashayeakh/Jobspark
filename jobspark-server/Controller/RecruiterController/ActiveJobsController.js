const activeJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");


const createActiveJobs = async (req, res) => {
    try {
        const allJobsData = req.body;

        console.log("All jobs ", allJobsData);

        const newJobs = new activeJobsModel(allJobsData);

        console.log("\nNew Job ", newJobs);


        const resultantJobs = await newJobs.save();
        res.status(201).json({
            message: "Active Jobs are created successfully",
            success: true,
            data: resultantJobs
        });

    } catch (err) {
        console.log("Err occured", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}

const showActiveJobs = async (req, res) => {

    const jobs = await activeJobsModel.find();

    // console.log("Jobs length", jobs.length);

    if (jobs.length > 0) {
        res.status(200).json({
            message: "Jobs are fetched successfully",
            success: true,
            data: jobs,
        })
    } else {
        res.status(404).json({
            message: "No jobs found",
            success: false,
        })
    }

}

const findActiveJobsById = async (req, res) => {
    const { id } = req.params; 
    console.log("ID ", id);

    if (!id) {
        return res.status(400).json({
            message: `ID is required`,
            success: false,
        });
    }

    try {
        const result = await activeJobsModel.findById(id);

        if (!result) {
            return res.status(404).json({
                message: `No job found with ID: ${id}`,
                success: false,
            });
        }

        res.status(200).json({
            message: "Fetched successfully",
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error fetching job by ID", error);
        res.status(500).json({
            message: "Something went wrong",
            success: false,
        });
    }
};


module.exports = { createActiveJobs, showActiveJobs, findActiveJobsById }