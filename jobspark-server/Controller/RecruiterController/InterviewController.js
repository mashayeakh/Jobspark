
/**
 *  Goal - send a post req to craete interview schedule having 
 * receruiter, job, applicant id, and goole meet or zoom link will be generated. 
 * 
 * input url - http://localhost:5000/recruiter/${recruiterId}interviews/schedule
 *  req - post
 */

const UserModel = require("../../Model/AccountModel/UserModel");
const ScheduledInterviewModel = require("../../Model/RecruiterModel/ScheduledInterviewModel");
const sendEmail = require("../../Utils/SendEmail");

const ScheduledInterview = async (req, res) => {

    try {


        const { recruiterId } = req.params;
        const allInfo = req.body;

        //attach the recruiterId here with the model
        allInfo.recruiter = recruiterId;


        //generate links
        let interviewLink = "";
        let value = "";

        if (allInfo.interviewType === "Google Meet") {

            value = Math.random().toString(36).substr(2, 10);
            console.log("Google Value ", value);
            interviewLink = `http://meet.google.com/${value}`;
            console.log("Goolge link", interviewLink);


        } else if (allInfo.interviewType === "Zoom") {
            value = Math.floor(Math.random() * 1000000000);
            console.log("Zoom value ", value);
            interviewLink = `http://zoom.us/${value}`;
            console.log("Zoom link", interviewLink);
        }


        //check if the applicant is already scheduled for interview 
        const alreadyScheduled = await ScheduledInterviewModel.findOne(
            {
                applicant: allInfo.applicant,
                job: allInfo.job,
                recruiter: allInfo.recruiter
            }
        )

        if (alreadyScheduled) {
            return res.status(409).json({
                status: false,
                message: "Interview already scheduled for this applicant and job.",
            });
        }

        //save into db
        const newScheduledInterview = new ScheduledInterviewModel(allInfo);

        const result = await newScheduledInterview.save();
        console.log("------\n\nResult ", result);

        //fetch the email
        const applicantInfo = await UserModel.findById(allInfo.applicant);
        // console.log("ApplicantInfo ", applicantInfo.email);

        const applicantEmail = applicantInfo.email;

        //email content
        const emailSubject = "Interview Scheduled";
        const emailBody = `Dear ${applicantInfo.name},\n\n
        <h3>Your interview has been scheduled!</h3>
      <p><strong>Date & Time:</strong> ${new Date(allInfo.dateTime).toLocaleString()}</p>
      <p><strong>Interview Type:</strong> ${allInfo.interviewType}</p>
      <p><strong>Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>
      <p><strong>Notes:</strong> ${allInfo.notes || "None"}</p>`

        //send the email
        await sendEmail(applicantEmail, emailSubject, emailBody)

        res.status(200).json({
            message: "Interview Scheduled Successfully",
            data: result,
        })


    } catch (error) {
        console.log(" error in ScheduledInterview", error);
        res.status(500).json({
            status: false,
            message: "Failed to schedule interview.",
            error: error.message,
        });
    }

}

module.exports = { ScheduledInterview }