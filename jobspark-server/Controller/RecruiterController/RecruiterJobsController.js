const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");
const JobApplicationModel = require("../../Model/JobApplicationModel/JobApplicationModel");
const userModel = require("../../Model/AccountModel/UserModel");
const { application } = require("express");



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

//depending on the num of applicants we will show the 
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

// job without nay applicants by a specific recruiter
// http://localhost:5000/api/v1/recruiter/${recruiterId}/no-jobs
const getJobsWithNoApplicantsByARecuiter = async (req, res) => {
    const { recruiterId } = req.params;
    console.log("ID ", recruiterId);

    if (!recruiterId) {
        return res.status(400).json({
            status: false,
            message: "Recruiter id is required",
        });
    }

    const gettingRecruiterJob = await ActiveJobsModel.find({ recruiter: recruiterId })

    if (!gettingRecruiterJob || gettingRecruiterJob.length === 0) {
        return res.status(400).json({
            status: false,
            message: "No jobs posted by recruiter",
        });
    }


    const result = gettingRecruiterJob.filter(c => (c.applicantsCount || 0) === 0);

    if (result.length > 0) {
        const titles = result.map(re => ({
            applicantsCount: re.applicantsCount,
            jobTitle: re.jobTitle
        }))
        console.log("Title ", titles);
        res.status(200).json({
            status: true,
            message: "Jobs with no applicants",
            data: {
                jobsWithNoApplicans: result,
                count: result.length,
            }
        })


    }
}

// get recently published job by a specific recruiter.
// http://localhost:5000/api/v1/recruiter/${recruiterId}/recent-jobs
const recentlyPublishedJobs = async (req, res) => {

    try {
        const { recruiterId } = req.params;
        console.log("ID ", recruiterId);


        if (!recruiterId) {
            return res.status(400).json({
                status: false,
                message: "Recruiter id is required",
            });
        }

        const gettingRecruiterJob = await ActiveJobsModel.find({ recruiter: recruiterId })

        if (!gettingRecruiterJob || gettingRecruiterJob.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No jobs posted by recruiter",
            });
        }

        // Sort jobs by createdAt descending and take the 3 most recent
        const mostRecentJobs = gettingRecruiterJob
            .sort((a, b) => (b.createdAt) - (a.createdAt))
            .slice(0, 3);

        console.log("3 Most Recent jobs:", mostRecentJobs);

        const mostRecerntTime = mostRecentJobs.map(time => time.createdAt)
        console.log(mostRecerntTime);

        res.status(200).json({
            status: true,
            message: "Recently published jobs",
            data: {
                recentlyPublishedJobs: mostRecentJobs,
                recentCreationTime: mostRecerntTime,
            }
        })
    } catch (err) {
        console.log("Error from recentlyPublishedJobs ", err.message);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        })
    }
}

//clsoing job by a recruiter.
//http://localhost:5000/api/v1/recruiter/${recruiterId}/closing-jobs
const closingJobByARecruiter = async (req, res) => {

    try {
        const { recruiterId } = req.params;
        console.log("Recruiter ID ", recruiterId);

        const gettingRecuiterJob = await ActiveJobsModel.find({ recruiter: recruiterId });


        if (!gettingRecuiterJob || gettingRecuiterJob.length === 0) {
            return res.status(400).json({
                status: false,
                message: "No jobs posted by recruiter",
            });
        }

        // Get both deadline and jobTitle for each job
        const deadline = gettingRecuiterJob.map(g => ({
            deadline: g.deadline,
            jobTitle: g.jobTitle,
        }));


        // Find the soonest (earliest) deadline
        // Find the 3 soonest (earliest) deadlines

        const now = new Date();

        // Filter deadlines in the future and sort by deadline ascending
        const sortedDeadlines = deadline
            .filter(d => new Date(d.deadline) > now)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 3); // Take the 3 earliest

        // Each item contains both deadline and jobTitle
        const closingSoon = sortedDeadlines.length > 0 ? sortedDeadlines : [];

        if (closingSoon && closingSoon.length > 0) {
            res.status(200).json({
                status: true,
                message: "Jobs closing soon",
                data: {
                    closingInfo: closingSoon,
                    count: closingSoon.length,
                }
            })
        }
    } catch (err) {
        console.log("Err from closing job", err.message);
    }

}


//send all the application info to recruiter
// http://localhost:5000/api/v1/recruiter/${recruiterId}/all-applications
const applicationsInfoToRecruiter = async (req, res) => {

    const { recruiterId } = req.params;
    console.log("\nRecruiter ID", recruiterId);


    const recruiterJobInfo = await ActiveJobsModel.find({ recruiter: recruiterId });

    console.log("recruiterJobInfo", recruiterJobInfo);
    console.log("recruiterJobInfo length", recruiterJobInfo.length);

    const result = recruiterJobInfo.filter(job => (job.applicantsCount || 0) > 0);

    console.log("Result ", result);
    console.log("Result length", result.length);

    const applicantsNum = result.map(re => re.applicantsCount)
    console.log("Applicants ", applicantsNum);
    res.status(200).json({
        status: true,
        message: "Jobs with applicants",
        data: {
            jobs: result,
            numOfApplicants: applicantsNum
        }
    })

}
//find user info who applied to the job posted by a specific recruiter.

const findApplicantsInfoByARecruiterJob = async (req, res) => {

    const { recruiterId, userId } = req.params;
    console.log("Recruiter Id, User Id ", recruiterId, userId);

    //get the jobs posted by the recruiter.
    const jobs = await ActiveJobsModel.find({ recruiter: recruiterId });
    console.log("Jobs == ", jobs);
    console.log("Jobs length == ", jobs.length);

    //jobs id from these jobs
    const jobsId = jobs.map(jobId => jobId._id)
    console.log("Jobs ID", jobsId);
    console.log("Jobs ID", jobsId.toString());


    //check if these jobIds are avaiable in job application of not
    const hasApplied = await JobApplicationModel.findOne({
        user: userId,
        job: { $in: jobsId }
    })

    console.log("Has Applied", hasApplied);



    res.send("testing..");

}





module.exports = { showRecuiterJobs, getMostPopularJobsByARecruiter, getJobsWithNoApplicantsByARecuiter, recentlyPublishedJobs, closingJobByARecruiter, applicationsInfoToRecruiter, findApplicantsInfoByARecruiterJob }