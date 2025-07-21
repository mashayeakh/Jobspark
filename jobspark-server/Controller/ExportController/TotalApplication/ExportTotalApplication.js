// export total Application including applicant id, applicant name, job id, title, employee type, status, application dtag, application msg

const JobApplicationModel = require("../../../Model/JobApplicationModel/JobApplicationModel");
const ActiveJobsModel = require("../../../Model/RecruiterModel/ActiveJobsModel");

// req - api : /recruiter/:recruiterId/total-application/export

const exportTotalApplication = async (req, res) => {
    const { recruiterId } = req.params;

    console.log("Recruiter Id ", recruiterId);


    const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId })
    console.log("Recruiter Jobs", recruiterJobs);
    console.log("Recruiter Jobs length", recruiterJobs.length);

    //extracting job ids
    const jobIds = recruiterJobs.map(job => job?._id);
    console.log("Job Ids ", jobIds);

    const appliedJob = await JobApplicationModel.find({
        job: { $in: jobIds }
    })

    console.log("Applied Job ", appliedJob);
    console.log("Applied Job length", appliedJob.length);

    

    res.send("Done ");
}

module.exports = { exportTotalApplication }