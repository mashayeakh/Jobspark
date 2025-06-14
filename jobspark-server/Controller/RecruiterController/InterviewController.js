
/**
 *  Goal - send a post req to craete interview schedule having 
 * receruiter, job, applicant id, and goole meet or zoom link will be generated. 
 * 
 * input url - http://localhost:5000/recruiter/${recruiterId}interviews/schedule
 *  req - post
 */

const { calendar } = require("../../Utils/google");
const ScheduledInterviewModel = require("../../Model/RecruiterModel/ScheduledInterviewModel");
const UserModel = require("../../Model/AccountModel/UserModel");
const sendEmail = require("../../Utils/sendEmail");

const ScheduledInterview = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const allInfo = req.body;

        allInfo.recruiter = recruiterId;

        let interviewLink = "";

        // Check if already scheduled
        const alreadyScheduled = await ScheduledInterviewModel.findOne({
            applicant: allInfo.applicant,
            job: allInfo.job,
            recruiter: allInfo.recruiter,
        });

        if (alreadyScheduled) {
            return res.status(409).json({
                status: false,
                message: "Interview already scheduled for this applicant and job.",
            });
        }

        // Fetch applicant info
        const applicantInfo = await UserModel.findById(allInfo.applicant);
        const applicantEmail = applicantInfo.email;

        // Generate real Google Meet link if selected
        if (allInfo.interviewType === "Google Meet") {
            const event = {
                summary: `Interview with ${applicantInfo.name}`,
                description: allInfo.notes || "",
                start: {
                    dateTime: allInfo.dateTime,
                    timeZone: "Asia/Dhaka",
                },
                end: {
                    dateTime: new Date(new Date(allInfo.dateTime).getTime() + 30 * 60000).toISOString(),
                    timeZone: "Asia/Dhaka",
                },
                attendees: [{ email: applicantEmail }],
                conferenceData: {
                    createRequest: {
                        requestId: `${Date.now()}-${Math.random()}`,
                        conferenceSolutionKey: { type: "hangoutsMeet" },
                    },
                },
            };

            const calendarResponse = await calendar.events.insert({
                calendarId: "primary",
                resource: event,
                conferenceDataVersion: 1,
            });
            console.log("Google Calendar event created:", calendarResponse.data);

            interviewLink = calendarResponse.data.hangoutLink;
        }

        // Dummy Zoom (or generate real Zoom if you integrate)
        if (allInfo.interviewType === "Zoom") {
            const value = Math.floor(Math.random() * 1000000000);
            interviewLink = `http://zoom.us/${value}`;
        }

        // Attach link to interview info
        allInfo.interviewLink = interviewLink;

        // Save to DB
        const newScheduledInterview = new ScheduledInterviewModel(allInfo);
        const result = await newScheduledInterview.save();

        // Email content
        const emailSubject = "Interview Scheduled";
        const emailBody = `
      <h3>Dear ${applicantInfo.name},</h3>
      <p>Your interview has been scheduled!</p>
      <p><strong>Date & Time:</strong> ${new Date(allInfo.dateTime).toLocaleString()}</p>
      <p><strong>Interview Type:</strong> ${allInfo.interviewType}</p>
      <p><strong>Link:</strong> <a href="${interviewLink}">${interviewLink}</a></p>
      <p><strong>Notes:</strong> ${allInfo.notes || "None"}</p>
    `;

        await sendEmail(applicantEmail, emailSubject, emailBody);

        res.status(200).json({
            status: true,
            message: "Interview Scheduled Successfully",
            data: result,
            meetLink: interviewLink || null,
        });
    } catch (error) {
        console.error("Error in ScheduledInterview:", error);
        res.status(500).json({
            status: false,
            message: "Failed to schedule interview.",
            error: error.message,
        });
    }
};

module.exports = { ScheduledInterview };
