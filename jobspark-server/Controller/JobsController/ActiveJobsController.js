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
    //job info from params.
    const { currentJobId } = req.params;
    console.log("Id from parameter --", currentJobId);

    //user info from body
    const { userInfo } = req.body;
    console.log("applied job user: ", userInfo);


    //now i need the full job info.
    //find the job by  id
    const jobInfo = await activeJobsModel.findById(currentJobId);
    console.log("Job Info ", jobInfo);

    //save info job applicaiton to track
    const newApplication = new JobApplicationModel({
        user: userInfo,
        job: currentJobId
    });
    await newApplication.save();
    console.log("Saving new application for user:", newApplication.user, newApplication.job);


    if (!jobInfo) {
        res.status(404).json({
            message: `No job found with ID: ${currentJobId}`,
            success: false,
        })
    }

    jobInfo.applicantsCount += 1;
    //now save into db
    await jobInfo.save();

    res.status(200).json({
        message: "Applied successfully done",
        success: true,
        userInfo: jobInfo,
    })

}

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


module.exports = { createActiveJobs, showActiveJobs, findActiveJobsById, applyToJobs, getJobsByRecruiterId }