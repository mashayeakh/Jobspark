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











module.exports = { test, shortListing }