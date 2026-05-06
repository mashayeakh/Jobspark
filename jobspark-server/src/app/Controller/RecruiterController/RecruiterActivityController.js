const { default: mongoose } = require("mongoose");
const UserModel = require("../../Model/AccountModel/UserModel");
const JobApplicationModel = require("../../Model/JobApplicationModel/JobApplicationModel");
const ActiveJobsModel = require("../../Model/RecruiterModel/ActiveJobsModel");
const RecruiterActivityModel = require("../../Model/RecruiterModel/RecruiterActivityModel");

const test = async (req, res) => {
    res.send("TEST...");
}


/**
 *  goal - make any applicant shortlisted / rejected 
 * 
 * input url- http://localhost:5000/api/v1/recruiter/${recruiterId}/applicant/${applicantId}
 *  method - post
 * 
 */
const shortListing = async (req, res) => {

    const { recruiterId, applicantId } = req.params;
    console.log("\n\n\n\n--------Recruiter Id and Applicant Id => ", recruiterId, applicantId);

    if (!recruiterId && !applicantId) {
        return res.status(400).json({
            status: false,
            message: "Recruiter and applicant id are required",
        });
    }

    //sending details in body
    const allInfo = req.body;
    // console.log("\n------Seding in body ", jobId, status);
    console.log("\n------Seding in body ", allInfo);

    if (!(allInfo.job && allInfo.status)) {
        return res.status(400).json({
            status: false,
            message: "Fields are required",
        })
    }

    //inject the recruiter and applicant ids into the body
    allInfo.recruiter = recruiterId;
    allInfo.appliant = applicantId;

    const newInfo = new RecruiterActivityModel(allInfo);
    const response = await newInfo.save();

    return res.status(200).json({
        status: true,
        message: `Applicant ${allInfo.status}ed`,
        data: response

    })
}


/**
 *  goal - to get the status of recruiter activite model like
 * 
 *input url -  http://localhost:5000/api/v1/recruiter/${recruiterId}/applicant/${applicantId}/job/${:jobID}/status
 *  method - get
 */

const getRecruiterStatus = async (req, res) => {
    const { recruiterId, applicantId, jobId } = req.params;

    console.log("\n\n-----Recruiter ID , Applicant ID, Job ID", recruiterId, applicantId, jobId);

    // const fullRecord = await RecruiterActivityModel.find({ recruiter: recruiterId }, {});

    // console.log("RECORD -> ", fullRecord);

    const record = await RecruiterActivityModel.findOne(
        { recruiter: recruiterId, applicant: applicantId, job: jobId },
    )

    if (!record) {
        return res.status(200).json({ status: null }); // No action yet
    }
    // Count the number of shortlisted and rejected applicants for this recruiter
    // const numOfShortListing = await RecruiterActivityModel.countDocuments({
    //     recruiter: recruiterId,
    //     status: "shortlisted",
    // })
    // console.log("Num of ShortListed ", numOfShortListing);
    // const numOfRejection = await RecruiterActivityModel.countDocuments({
    //     recruiter: recruiterId,
    //     status: "rejected",
    // })
    // console.log("Num of Rejected ", numOfRejection);


    // You can include these counts in the response if needed
    // Example: res.status(200).json({ status: record.status, shortlistedCount, rejectedCount });


    return res.status(200).json({
        status: record.status,
        // shortlistedCount: numOfShortListing,
        // rejectedCount: numOfRejection
    })
}

/**
 * goal - find the num of short listed and rejected candidates. 
 * input - http://localhost:5000/api/v1/recruiter/6839c86523d93cb0daa3de99/numOfStatus
 */
const getNumOfStatus = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        const numOfShortListing = await RecruiterActivityModel.countDocuments({
            recruiter: recruiterId,
            status: "shortlisted",
        });
        const numOfRejection = await RecruiterActivityModel.countDocuments({
            recruiter: recruiterId,
            status: "rejected",
        });

        return res.status(200).json({
            success: true,
            shortlistedCount: numOfShortListing,
            rejectedCount: numOfRejection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching status counts",
            error: error.message,
        });
    }
};

/**
 * 
 *  goal - find the list of shortlisted candidates information 
 *  input url - http://localhost:5000/api/v1/recruiter/${recruiterId}/shortlisted-Candidates
 *  
 *  Req - get
 *
 */
const getShortlistedCandidates = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        const activities = await RecruiterActivityModel.find({
            recruiter: recruiterId,
            status: "shortlisted"  // ✅ Only fetch shortlisted candidates
        })
            .populate("job")
            .populate("applicant")
            .exec();

        const responseData = activities.map((activity) => {
            const applicant = activity.applicant;
            const job = activity.job;

            return {
                name: applicant.name,
                applicantId: applicant._id,
                email: applicant.email,
                university: applicant.university,
                skills: Array.isArray(applicant.skills)
                    ? applicant.skills.join(", ")
                    : applicant.skills,
                experienceLevel: applicant.experienceLevel,
                jobTitle: job.jobTitle,
                jobId: job._id
            };
        });

        console.log(responseData);


        res.status(200).json({
            status: true,
            message: "Shortlisted Candidates List",
            data: responseData
        });

    } catch (error) {
        console.error("Error in fetching shortlisted candidates:", error);
        res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

//req - GET /api/v1/jobs/recruiter/:recruiterId/daily-activity


const getDailyActivity = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        // Step 1: Get all job IDs for the recruiter
        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });

        const recruiterJobIds = recruiterJobs.map(job => job._id);

        // Step 2: Get new applicants (JobApplicationModel)
        const applications = await JobApplicationModel.find({
            job: { $in: recruiterJobIds },
        });

        const newPerDay = {};
        applications.forEach(r => {
            const date = new Date(r.createdAt).toLocaleDateString();
            newPerDay[date] = (newPerDay[date] || 0) + 1;
        });

        // Step 3: Get shortlisted per day (RecruiterActivityModel)
        const shortlistActivities = await RecruiterActivityModel.find({
            job: { $in: recruiterJobIds },
            recruiter: recruiterId,
            status: "shortlisted"
        });

        const shortlistedPerDay = {};
        shortlistActivities.forEach(r => {
            const date = new Date(r.createdAt).toLocaleDateString();
            shortlistedPerDay[date] = (shortlistedPerDay[date] || 0) + 1;
        });

        // Step 4: Combine dates
        const allDates = Array.from(
            new Set([...Object.keys(newPerDay), ...Object.keys(shortlistedPerDay)])
        ).sort((a, b) => new Date(a) - new Date(b));

        const finalData = allDates.map(date => ({
            date,
            new: newPerDay[date] || 0,
            shortlisted: shortlistedPerDay[date] || 0
        }));

        return res.status(200).json({
            success: true,
            data: finalData
        });

    } catch (error) {
        console.error("Error fetching daily activity:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// req = Get  /api/v1/jobs/recruiter/:recruiterId/app-perHour

const getAppPerHour = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        // ✅ Validate recruiter ID
        if (!recruiterId || !mongoose.Types.ObjectId.isValid(recruiterId)) {
            return res.status(400).json({ success: false, message: "Invalid recruiter ID" });
        }

        // ✅ Get recruiter's jobs
        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });
        if (recruiterJobs.length === 0) {
            return res.status(200).json({ success: true, message: "No jobs found for this recruiter", data: [] });
        }

        const jobIds = recruiterJobs.map(job => job._id);

        // ✅ Get applications for those jobs
        const applications = await JobApplicationModel.find({ job: { $in: jobIds } });
        if (applications.length === 0) {
            return res.status(200).json({ success: true, message: "No applications found for this recruiter", data: [] });
        }

        // ✅ Count by hour
        const hourlyCounts = {};
        applications.forEach(app => {
            const hour = new Date(app.createdAt).getHours(); // 0–23
            hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
        });

        // ✅ Format data for frontend
        const formattedData = [];
        for (let i = 0; i < 24; i++) {
            const hourStr = i.toString().padStart(2, '0');
            formattedData.push({
                hour: hourStr,
                apps: hourlyCounts[i] || 0
            });
        }

        return res.status(200).json({
            success: true,
            message: "Applications grouped by hour",
            data: formattedData
        });

    } catch (error) {
        console.error("Error in getAppPerHour:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching hourly application data"
        });
    }
};

// req = Get  /api/v1/jobs/recruiter/:recruiterId/categorywise-App
const getCategoryWiseApplications = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        // ✅ Validate recruiter ID
        if (!recruiterId || !mongoose.Types.ObjectId.isValid(recruiterId)) {
            return res.status(400).json({ success: false, message: "Invalid recruiter ID" });
        }

        // ✅ Step 1: Get all jobs posted by this recruiter
        const recruiterJobs = await ActiveJobsModel.find({ recruiter: recruiterId });
        if (recruiterJobs.length === 0) {
            return res.status(200).json({ success: true, message: "No jobs found", data: [] });
        }

        const jobIdToCategoryMap = {};
        recruiterJobs.forEach(job => {
            jobIdToCategoryMap[job._id.toString()] = job.jobCategory;
        });

        const jobIds = recruiterJobs.map(job => job._id);

        // ✅ Step 2: Find all applications to these jobs
        const applications = await JobApplicationModel.find({
            job: { $in: jobIds }
        });

        // ✅ Step 3: Count category-wise applications
        const categoryCounts = {};

        applications.forEach(app => {
            const jobId = app.job.toString();
            const category = jobIdToCategoryMap[jobId] || "Unknown";

            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        // ✅ Step 4: Format for frontend
        const formattedData = Object.entries(categoryCounts).map(([category, count]) => ({
            category,
            count
        }));

        return res.status(200).json({
            success: true,
            message: "Category-wise applications",
            data: formattedData
        });

    } catch (error) {
        console.error("Error in getCategoryWiseApplications:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching category-wise applications"
        });
    }
};






module.exports = { test, shortListing, getRecruiterStatus, getNumOfStatus, getNumOfStatus, getShortlistedCandidates, getDailyActivity, getAppPerHour, getCategoryWiseApplications }