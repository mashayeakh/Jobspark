const ActiveJobsModel = require("../../../Model/RecruiterModel/ActiveJobsModel");

const { Parser } = require("json2csv");

// Req - get - /recruiter/:recruiterId/active-jobs/export
const exportActiveJobs = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        // ✅ Validate recruiterId
        if (!recruiterId) {
            return res.status(400).json({
                success: false,
                message: "Recruiter ID is required",
            });
        }

        // ✅ Fetch recruiter's active jobs
        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });

        if (recruiterJobs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active jobs found for the recruiter",
            });
        }

        // ✅ Format job data
        const jobData = recruiterJobs.map((job) => ({
            Job_Title: job.jobTitle,
            Employment_Type: job.employeeType,
            Location: job.location,
            Deadline: new Date(job.deadline).toLocaleDateString(),
            Created_At: new Date(job.createdAt).toLocaleDateString(),
        }));

        const csv = new Parser().parse(jobData);

        // ✅ Set CSV headers
        res.setHeader("Content-Disposition", "attachment; filename=active_jobs.csv");
        res.setHeader("Content-Type", "text/csv");

        // return res.status(200).send({
        //     success: true,
        //     data: csv,
        // });
        return res.status(200).send(csv);

    } catch (error) {
        console.error("Error exporting active jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while exporting active jobs",
        });
    }
};

module.exports = { exportActiveJobs }