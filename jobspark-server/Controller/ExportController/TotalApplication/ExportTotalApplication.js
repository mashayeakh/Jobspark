// export total Application including applicant id, applicant name, job id, title, employee type, status, application dtag, application msg
const { Parser } = require("json2csv");


const JobApplicationModel = require("../../../Model/JobApplicationModel/JobApplicationModel");
const ActiveJobsModel = require("../../../Model/RecruiterModel/ActiveJobsModel");

// req - api : /recruiter/:recruiterId/total-application/export

const exportTotalApplication = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        if (!recruiterId) {
            return res.status(400).json({ error: "Recruiter ID is required" });
        }

        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });
        if (!recruiterJobs || recruiterJobs.length === 0) {
            return res.status(404).json({ error: "No jobs found for this recruiter" });
        }

        const jobIds = recruiterJobs.map(job => job?._id);

        const appliedJob = await JobApplicationModel.find({
            job: { $in: jobIds }
        })
            .populate("job")
            .populate("user")
            .select('job user status createdAt');

        if (!appliedJob || appliedJob.length === 0) {
            return res.status(404).json({ error: "No applications found for these jobs" });
        }

        const applictionData = appliedJob.map(app => ({
            applied_id: app.user?._id?.toString() || "",
            Applicant_Name: app.user?.name || "",
            Job_ID: app.job?._id?.toString() || "",
            Job_Title: app.job?.jobTitle || "",
            Employment_Type: app.job?.employeeType || "",
            Status: app.status || "",
            Application_Date: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "",
        }));

        const csv = new Parser().parse(applictionData);

        res.setHeader("Content-Disposition", "attachment; filename=applications.csv");
        res.setHeader("Content-Type", "text/csv");
        res.status(200).send(csv);
    } catch (error) {
        console.error("Error exporting applications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { exportTotalApplication }