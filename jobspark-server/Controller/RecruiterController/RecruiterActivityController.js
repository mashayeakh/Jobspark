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
            shortlistedCount: numOfShortListing,
            rejectedCount: numOfRejection,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
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
                email: applicant.email,
                university: applicant.university,
                skills: Array.isArray(applicant.skills)
                    ? applicant.skills.join(", ")
                    : applicant.skills,
                experienceLevel: applicant.experienceLevel,
                jobTitle: job.jobTitle
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








module.exports = { test, shortListing, getRecruiterStatus, getNumOfStatus, getNumOfStatus, getShortlistedCandidates }