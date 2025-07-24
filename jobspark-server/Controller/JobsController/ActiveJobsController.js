const UserModel = require("../../Model/AccountModel/UserModel");
const JobApplicationModel = require("../../Model/JobApplicationModel/JobApplicationModel");
const activeJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");

//create active jobs
//http://localhost:5000/api/v1/recruiter?recruiterId=${user._id}
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
            status: true,
            data: result
        });

    } catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

//show all active jobs
//http://localhost:5000/api/v1/
const showActiveJobs = async (req, res) => {

    const jobs = await activeJobsModel.find().populate("recruiter",);

    if (!jobs || jobs.length === 0) {
        return res.status(404).json({
            message: "No jobs found",
            status: false,
        });
    }

    if (jobs.length > 0) {
        res.status(200).json({
            message: "Jobs are fetched successfully",
            status: true,
            data: jobs,
        })
    } else {
        res.status(404).json({
            message: "No jobs found",
            status: false,
        })
    }
}


//find active jobs by id means active job details
// http://localhost:5000/api/v1/job/${id}
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


//apply to jobs, you need job id and the specific recruiter's info
// http://localhost:5000/api/v1/apply/job/${currJobId}
const applyToJobs = async (req, res) => {
    const { currentJobId } = req.params;
    const { userInfo } = req.body;

    console.log("Id from parameter --", currentJobId);
    console.log("applied job user: ", userInfo);

    const jobInfo = await activeJobsModel.findById(currentJobId);
    if (!jobInfo) {
        return res.status(404).json({
            message: `No job found with ID: ${currentJobId}`,
            success: false,
        });
    }

    // Save new job application
    const newApplication = new JobApplicationModel({
        user: userInfo._id,
        job: currentJobId,
    });
    await newApplication.save();

    // Increment job applicant count
    jobInfo.applicantsCount += 1;
    await jobInfo.save();

    // ✅ Update user with job application info
    const user = await UserModel.findById(userInfo._id).select("+appliedJobIds +appliedApplicationCount");

    // Ensure appliedJobIds is always an array
    if (!Array.isArray(user.appliedJobIds)) {
        user.appliedJobIds = [];
    }

    if (!user.appliedJobIds.includes(currentJobId)) {
        user.appliedJobIds.push(currentJobId);
        user.appliedApplicationCount = (user.appliedApplicationCount || 0) + 1;
        await user.save();
    }

    return res.status(200).json({
        message: "Applied successfully done",
        success: true,
        userInfo: jobInfo,
    });
};


//getting all the jobs that posted by a specific recruiter
//http://localhost:5000/api/v1/recruiter?recruiterId=${id}
const getJobsByRecruiterId = async (req, res) => {
    try {
        const { recruiterId } = req.query;

        if (!recruiterId) {
            return res.status(400).json({ message: "recruiterId is required" });
        }

        const jobs = await activeJobsModel.find({ recruiter: recruiterId });

        res.status(200).json({
            success: true,
            data: jobs
        });

    } catch (err) {
        console.error("Error fetching jobs by recruiter:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

// url = http://localhost:5000/api/v1/category/:categoryName
/**
 * *Finds and returns jobs by category name.
 *
 * input url - // url = http://localhost:5000/api/v1/category/:categoryName
 * 
 * req - Get
 * 
 * @async
 * @function findJobsByCategory
 * @param {import('express').Request} req - Express request object, expects `categoryName` in `req.params`.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with jobs data or error message.
 *
 * @throws {400} If category name is not provided.
 * @throws {404} If no jobs are found for the given category.
 * @throws {500} If an internal server error occurs.
 */
const findJobsByCategory = async (req, res) => {
    const { categoryName } = req.params;
    // const categoryName = decodeURIComponent(rawCategory); // safe decoding



    if (!categoryName) {
        return res.status(400).json({
            message: "Category name is required",
            success: false,
        });
    }

    try {
        const jobs = await activeJobsModel.find({ jobCategory: categoryName });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: `No jobs found for category: ${categoryName}`,
                success: false,
            });
        }

        res.status(200).json({
            message: "Jobs fetched successfully",
            success: true,
            data: jobs,
            size: jobs.length
        });
    } catch (error) {
        console.error("Error fetching jobs by category", error);
        res.status(500).json({
            message: "Something went wrong",
            success: false,
        });
    }
}


module.exports = { createActiveJobs, showActiveJobs, findActiveJobsById, applyToJobs, getJobsByRecruiterId, findJobsByCategory }