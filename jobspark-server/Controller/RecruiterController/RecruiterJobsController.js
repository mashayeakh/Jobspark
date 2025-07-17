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
const findAllUserAppliedToRecruiterJobs2 = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        if (!recruiterId) {
            return res.status(400).json({ success: false, message: "Recruiter ID is required." });
        }

        // 1. Get all jobs posted by the recruiter
        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });

        if (!recruiterJobs.length) {
            return res.status(404).json({ success: false, message: "No jobs found for this recruiter." });
        }

        const jobIds = recruiterJobs.map(job => job._id);

        // 2. Find all applications to those jobs
        const applications = await JobApplicationModel.find({
            job: { $in: jobIds }
        }).populate("user");

        if (!applications.length) {
            return res.status(404).json({ success: false, message: "No applications found for recruiter's jobs." });
        }

        // 3. Group by user and collect applied jobs
        const userJobMap = new Map();

        applications.forEach(app => {
            if (!app.user) return; // skip if user info missing (optional safety)

            const userId = app.user._id.toString();
            const jobId = app.job.toString();

            if (!userJobMap.has(userId)) {
                userJobMap.set(userId, {
                    name: app.user.name,
                    appliedJobIds: [jobId]
                });
            } else {
                userJobMap.get(userId).appliedJobIds.push(jobId);
            }
        });

        // 4. Build final result array
        const result = Array.from(userJobMap.values()).map(user => ({
            name: user.name,
            appliedJobCount: user.appliedJobIds.length,
            appliedJobIds: user.appliedJobIds
        }));

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error in findAllUserAppliedToRecruiterJobs2:", error);
        return res.status(500).json({ success: false, message: "Server error occurred." });
    }
};






/**
 *  suppose receruitert Id is abc posted 3 jobs [1,2,3] and 
 *  2 users appoied to job 1. 
 *  now find all the users who applied to recruiter jobs it means
 *  you need to find that 2 users info
 *   input - http://localhost:5000/api/v1/recruiter/${user?._id}/all-applicants-info
 */
const findAllUserAppliedToRecruiterJobs = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        // Step 1: Get all job IDs posted by this recruiter
        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });
        const recruiterJobIds = recruiterJobs.map(job => job._id);

        console.log("REcuiter jods ", recruiterJobIds);

        // Step 2: Get all applications to these jobs with user and job populated
        const allApplications = await JobApplicationModel.find({
            job: { $in: recruiterJobIds },
        })
            .populate("user")
            .populate("job");

        console.log("All app", allApplications);
        console.log("All app length", allApplications.length);

        // Step 3: Create flat list (each application is one record)
        const flatResult = allApplications
            .filter(app => app.user && app.job) // <- ✅ skip broken refs
            .map(app => ({
                userId: app.user._id.toString(),
                userName: app.user.name,
                jobId: app.job._id.toString(),
                jobTitle: app.job.jobTitle,
                jobType: app.job.jobCategory,
                status: app.job.status
            }));


        // Step 4: Optional sort by userName
        flatResult.sort((a, b) => a.userName.localeCompare(b.userName));
        console.log("Flat result", flatResult);

        console.log("FLAT RESUKT ", flatResult);

        // Step 5: Send response
        res.status(200).json({
            success: true,
            message: "All users who applied to this recruiter's jobs",
            count: flatResult.length,
            data: flatResult
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * fetch the applicant detiails to Recruiter jobs
 * 
 * You need recruiter id and applicant's id. 
 */
//http://localhost:5000/api/v1/recruiter/6839c86523d93cb0daa3de99/applicant/683d67fdc5c43a2f8a2ad298/job/:jobId
const findApplicantDetailsInfoToRecruiterJob = async (req, res) => {
    try {
        const { recruiterId, applicantId, jobId } = req.params;

        console.log("Recruiter:", recruiterId, "Applicant:", applicantId, "Job:", jobId);

        // Find specific job application
        const matchingApp = await JobApplicationModel.findOne({
            user: applicantId,
            job: jobId
        }).populate("job").lean();

        if (!matchingApp) {
            return res.status(404).json({
                success: false,
                message: "No matching job application found for this applicant under this recruiter."
            });
        }

        // Optional: Validate recruiter ownership
        if (matchingApp.job.recruiter.toString() !== recruiterId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Recruiter does not own this job."
            });
        }

        // Get applicant info
        const userInfo = await userModel.findById(applicantId).lean();

        return res.status(200).json({
            success: true,
            message: "Applicant job info fetched successfully.",
            data: {
                jobAppliedInfo: matchingApp,
                applicant: userInfo
            }
        });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};




/**
 *  suppose today is 3rd of June, 2025. how many applications have been submitted to day?
 * 
 * input - recruiter id, 
 * 
 * http://localhost:5000/api/v1/today/recruiter/{$recuiterId}
 */

const todaysNewApplication = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        console.log("\n\n\n\n--------Recruiter Id ", recruiterId);

        // Get all the job IDs corresponding to the recruiter ID
        const jobIds = await ActiveJobsModel.find({ recruiter: recruiterId }).select("_id");
        console.log("Job Ids =>", jobIds);
        console.log("Job Ids length =>", jobIds.length);

        // Get all the job applications corresponding to these job IDs
        const jobApplications = await JobApplicationModel.find({
            job: { $in: jobIds }
        });

        console.log("Job Applications :", jobApplications);
        console.log("Job Applications length:", jobApplications.length);

        // Extract unique job IDs from job applications
        const uniqueJobIds = [...new Set(jobApplications.map(id => id.job.toString()))];
        console.log("Unique Job IDs", uniqueJobIds);

        // Organize appliedAt dates for each job ID
        const appliedAtJobIds = uniqueJobIds.map(jobId => {
            const appliedAtDates = jobApplications
                .filter(app => app.job.toString() === jobId)
                .map(app => app.appliedAt);

            return {
                appliedAt: appliedAtDates
            };
        });

        console.log("AppliedAt by JobId (Full Data):", jobApplications, appliedAtJobIds);
        console.log("AppliedAt by JobId:", appliedAtJobIds);

        // Flatten all appliedAt timestamps
        const extractingAppliedJobTime = appliedAtJobIds.map(appDate => appDate.appliedAt).flat();
        console.log("Extracting Applied job Time", extractingAppliedJobTime);

        // Just converting for curiosity (not used later)
        const converstion = extractingAppliedJobTime.toString();

        // Define today's start and end time
        const startingTime = new Date();
        startingTime.setHours(0, 0, 0, 0);

        const endingTime = new Date();
        endingTime.setHours(23, 59, 59, 999);

        // Find applications submitted today
        const todaysApplications = await JobApplicationModel.find({
            job: { $in: uniqueJobIds },
            appliedAt: { $gte: startingTime, $lte: endingTime }
        });

        console.log("Today's applications:", todaysApplications);
        console.log("Today's applications length:", todaysApplications.length);

        // Send response
        res.status(200).json({
            status: true,
            message: "Today's applications fetched successfully",
            count: todaysApplications.length,
            data: todaysApplications
        });

        // If you want to replace the above with a generic done message
        // res.send("Done");

    } catch (error) {
        console.error("Error fetching today's applications from sever -  todaysNewApplication:", error);
        res.status(500).json({
            status: false,
            message: "Internal server error. Could not fetch today's applications.",
            error: error.message
        });
    }
};


/**
 * *Retrieves all active jobs posted by a specific recruiter.
 * 
 * input - http://localhost:5000/api/v1/jobs/recruiter/:recruiterId
 * Req - Get
 *
 * @async
 * @function findjobsByRecruiterId
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.recruiterId - The ID of the recruiter.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Sends a JSON response with the jobs data or an error message.
 */
const findjobsByRecruiterId = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        if (!recruiterId) {
            return res.status(400).json({
                status: false,
                message: "Recruiter id is required",
            });
        }

        const now = new Date();

        const jobs = await ActiveJobsModel.find({
            recruiter: recruiterId,
            status: "ongoing",
            deadline: { $gte: now }, // 🔒 ensure it's not expired
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No active jobs found for this recruiter",
            });
        }

        const updatedJobs = jobs.map(job => {
            const jobObj = job.toObject();
            jobObj.deadline = new Date(jobObj.deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            return jobObj;
        });

        res.status(200).json({
            status: true,
            message: "Active jobs fetched successfully",
            data: updatedJobs,
            length: jobs.length
        });
    } catch (err) {
        console.error("Error in findjobsByRecruiterId:", err.message);
        res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
};


// active jobs
// req - get => /activeJobs/:recruiterId
const fethcActiveJobs = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const now = new Date();

        const jobs = await ActiveJobsModel
            .find({ recruiter: recruiterId, status: "ongoing" })

        // .where('deadline').lt(now);

        // jobs.forEach(job => {
        //     console.log("Deadline:", job.deadline.toISOString());
        // });

        res.status(200).json({
            success: true,
            count: jobs.length,
            message: "Active jobs fetched",
            data: jobs,
        });
    } catch (err) {
        console.error("Error fetching expired jobs:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//expired jobs
//req - get => /expiredJobs/:recruiterId 
const fetchExpiredJobs = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const now = new Date();

        const jobs = await ActiveJobsModel
            .find({ recruiter: recruiterId, status: "expired" })

            .where('deadline').lt(now);

        jobs.forEach(job => {
            console.log("Deadline:", job.deadline.toISOString());
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            message: "Expired jobs fetched",
            data: jobs,
        });
    } catch (err) {
        console.error("Error fetching expired jobs:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


const expireOldJobs = async () => {
    try {
        const now = new Date();

        const result = await ActiveJobsModel.updateMany(
            {
                deadline: { $lt: now },
                status: { $ne: "expired" },
            },
            { $set: { status: "expired" } }
        );

        // console.log(`✅ ${result.modifiedCount} jobs marked as expired`);
    } catch (error) {
        console.error("❌ Error expiring jobs:", error.message);
    }
};





module.exports = {
    showRecuiterJobs, getMostPopularJobsByARecruiter, getJobsWithNoApplicantsByARecuiter, recentlyPublishedJobs, closingJobByARecruiter, applicationsInfoToRecruiter, findApplicantInfoByARecruiterJob, findAllUserAppliedToRecruiterJobs, findApplicantDetailsInfoToRecruiterJob, todaysNewApplication, findjobsByRecruiterId, fetchExpiredJobs, expireOldJobs,
    fethcActiveJobs, findAllUserAppliedToRecruiterJobs2
}