const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");
const JobApplicationModel = require("../../Model/JobApplicationModel/JobApplicationModel");
const userModel = require("../../Model/AccountModel/UserModel");
const { application } = require("express");
const UserModel = require("../../Model/AccountModel/UserModel");



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
//find  a  user info who applied to the job posted by a specific recruiter.
// http://localhost:5000/api/v1/recruiter/${recuiterId}/user/${userId}
const findApplicantInfoByARecruiterJob = async (req, res) => {

    //recruiter id and user id
    const { recruiterId, userId } = req.params;
    console.log("\nRecruiter and user id ", recruiterId, userId);


    //find all the jobs posted by this recruiter through his id. 
    const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId })
    console.log("Recruiter Jobs", recruiterJobs);
    console.log("Recruiter Jobs length", recruiterJobs.length);


    //find the job id from recruiter jobs
    const jobIdPostedByRecruiter = await recruiterJobs.map(job => job._id)
    console.log("Job Ids posted by recruiter", jobIdPostedByRecruiter);


    const userAppliedAllJobs = await JobApplicationModel.find({ user: userId })
    console.log("User Applied all jobs ", userAppliedAllJobs);
    console.log("User Applied all jobs length", userAppliedAllJobs.length);
    console.log(`User ${userId} applied to job -  ${jobIdPostedByRecruiter}`);

    //userInformation 
    const userInfor = await userModel.findById(userId, {})
    console.log("\nUer who applied to jobs ", userInfor);




    // // now match user id with this job id if user applied to this job or not.
    // const isApplied = await JobApplicationModel.findOne({
    //     user: userId,
    //     job: { $in: jobIdPostedByRecruiter }
    // })

    // console.log(`${userId} user applied to re cruiter ${recruiterId} job`, isApplied);


    // if (isApplied) {
    //     console.log("User has applied to", 1, "job(s)");
    // } else {
    //     console.log("User has applied to", 0, "job(s)");
    // }

    // // //getting the user information who applied
    // // // const id = await userModel.find({ id: userId })
    // // console.log("user id", userId);

    // // const id = await userModel.findById(userId, {})
    // // console.log("ID ", id);
    //user id
    res.send("Testing..")

}


//find all the users who applied to recruiter jobs
/**
 *  suppose receruitert Id is abc posted 3 jobs [1,2,3] and 
 *  2 users appoied to job 1. 
 *  now find all the users who applied to recruiter jobs it means
 *  you need to find that 2 users info
 * 
 * for that you need recruiter id and job posted id. 
 * 
 */
//http://localhost:5000/api/v1/recruiter/${recruiterId}/applicants
// const findAllUserAppliedToRecruiterJobs = async (req, res) => {
//     const { recruiterId } = req.params;

//     console.log("\n\nRecruiterId ", recruiterId);

//     //find the all jobs
//     const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId })

//     console.log("\n\nRecruiter JOBS ", recruiterJobs);
//     console.log("\n\nRecruiter JOBS length", recruiterJobs.length);

//     const jobId = recruiterJobs.map(re => re._id)
//     console.log("Job Id s ", jobId);


//     //now find all users who applied to these jobs
//     const allAppliedJobs = await JobApplicationModel.find({
//         job: { $in: jobId },
//     })

//     console.log("\n\allAppliedJobs ", allAppliedJobs);


//     const userId = allAppliedJobs.map(u => u.user)
//     // console.log("User id ", userId);

//     //Find all the user
//     const allUsers = await UserModel.find(
//         { _id: { $in: userId } }
//     ).select("+appliedJobIds +appliedApplicationCount");

//     console.log("All User ", allUsers);


//     // get the applied job ids
//     const appliedJobIds = allUsers.map(ids => ids.appliedJobIds).flat();
//     console.log("appliedJobIds ", appliedJobIds);

//     const matched_ids = await ActiveJobsModel.find({
//         _id: { $in: appliedJobIds }
//     })

//     console.log("Matched Ids ", matched_ids);
//     console.log("Matched Ids length", matched_ids.length);




//     // all user i can fetch the ids
//     const appliedJobsId = allUsers.map(jobs => jobs.appliedJobIds).flat()

//     // console.log("appliedJobsId", appliedJobsId);

//     //now i can fetch the job infor
//     const info = await ActiveJobsModel.find({ _id: appliedJobsId })
//     // console.log("Job info ", info);
//     // console.log("Job info length", info.length);


//     //extract the jobTitle, status, jobType
//     const result = info.map(job => ({
//         jobTitle: job.jobTitle,
//         status: job.status,
//         jobType: job.jobCategory
//     }))


//     // console.log("\nFinal result ", result);
//     // console.log("\nFinal result length ", result.length);


//     res.status(200).json({
//         status: true,
//         message: "All user applied to recruiter jobs",
//         data: {
//             userInfo: allUsers,
//             jobInfo: result,
//             matchedJobs: matched_ids,
//         }
//     })

//     // res.send("Done");
// }

const findAllUserAppliedToRecruiterJobs = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        // Step 1: Get all job IDs posted by this recruiter
        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });

        const recruiterJobIds = recruiterJobs.map(job => job._id);

        // Step 2: Get all applications to these jobs
        const allApplications = await JobApplicationModel.find({
            job: { $in: recruiterJobIds },
        }).populate("user").populate("job");

        // Step 3: Map result
        const result = allApplications.map(app => ({
            userId: app.user._id,
            userName: app.user.name,
            jobId: app.job._id,
            jobTitle: app.job.jobTitle,
            jobType: app.job.jobCategory,
            status: app.job.status,
        }));

        res.status(200).json({
            status: true,
            message: "All users who applied to this recruiter's jobs",
            data: result
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ status: false, message: "Server error" });
    }
};




module.exports = { showRecuiterJobs, getMostPopularJobsByARecruiter, getJobsWithNoApplicantsByARecuiter, recentlyPublishedJobs, closingJobByARecruiter, applicationsInfoToRecruiter, findApplicantInfoByARecruiterJob, findAllUserAppliedToRecruiterJobs }