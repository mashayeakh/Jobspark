const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");
const JobApplicationModel = require("../../Model/JobApplicationModel/JobApplicationModel");
const userModel = require("../../Model/AccountModel/UserModel");



//show recruiter posted jobs.
//http://localhost:5000/api/v1/job/recruiter
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

//depending on the num of applicants we will show the jobs
// http://localhost:5000/api/v1/recruiter/${recruiterId}}/popular-jobs
const getMostPopularJobsByARecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        console.log("Recruiter id:", recruiterId);

        if (!recruiterId) {
            return res.status(400).json({
                status: false,
                message: "Recruiter id is required",
            });
        }

        const gettingRecruiterJob = await ActiveJobsModel.find({ recruiter: recruiterId });


        console.log("GEtting job ", gettingRecruiterJob);



        if (!gettingRecruiterJob || gettingRecruiterJob.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No jobs posted by recruiter",
            });
        }

        const numOfApplicants = gettingRecruiterJob.map(r => ({
            applicantsCount: r.applicantsCount || 0,
            jobTitle: r.jobTitle,
            jobId: r._id,
            deadline: r.deadline
        }));

        console.log("Num of applications ", numOfApplicants);

        if (numOfApplicants.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No jobs with applicants",
            });
        }

        const largestVal = numOfApplicants.reduce(
            (largest, current) =>
                current.applicantsCount > largest.applicantsCount ? current : largest,
            numOfApplicants[0]
        );

        console.log("Largest ", largestVal);

        return res.status(200).json({
            status: true,
            message: "Job with most applicants",
            data: largestVal,
        });

    } catch (err) {
        console.log("Err from getMostPopularJobsByARecruiter: ", err.message);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};





module.exports = { showRecuiterJobs, getMostPopularJobsByARecruiter }