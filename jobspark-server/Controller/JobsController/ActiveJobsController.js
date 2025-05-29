const activeJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

const createActiveJobs = async (req, res) => {
    try {
        const allJobsData = req.body; // coming including recuiter.

        if (!allJobsData.recruiter) {
            return res.status(400).json({ message: "Recruiter ID is required" });
        }

        const newJobs = new activeJobsModel(allJobsData);
        const result = await newJobs.save();

        res.status(201).json({
            message: "Job created successfully",
            success: true,
            data: result
        });

    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const showActiveJobs = async (req, res) => {

    const jobs = await activeJobsModel.find().populate("recruiter",);

    console.log("Jobs ", jobs);

    // console.log("Jobs length", jobs.length);

    if (!jobs || jobs.length === 0) {
        return res.status(404).json({
            message: "No jobs found",
            success: false,
        });
    }

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


// const showRecruiterJobs = async (req, res) => {
//     const recruiterId = req.query.recruiterId; // this assumes you've set req.user during login

//     try {
//         const jobs = await activeJobsModel
//             .find({ recruiter: recruiterId })
//             .populate("recruiter", "name email");

//         if (!jobs || jobs.length === 0) {
//             return res.status(404).json({
//                 message: "No jobs found for this recruiter",
//                 success: false,
//             });
//         }

//         res.status(200).json({
//             message: "Jobs fetched successfully for this recruiter",
//             success: true,
//             data: jobs,
//         });
//     } catch (error) {
//         console.error("Error fetching recruiter's jobs:", error);
//         res.status(500).json({
//             message: "Something went wrong",
//             success: false,
//             error: error.message
//         });
//     }
// };



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


module.exports = { createActiveJobs, showActiveJobs, findActiveJobsById, }