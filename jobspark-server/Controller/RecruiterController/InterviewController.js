
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
            const startDate = new Date(allInfo.dateTime);
            if (isNaN(startDate.getTime())) {
                throw new Error("Invalid dateTime format");
            }
            const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes later

            const event = {
                summary: `Interview with ${applicantInfo.name}`,
                description: allInfo.notes || "",
                start: {
                    dateTime: startDate.toISOString(),
                    timeZone: "Asia/Dhaka",
                },
                end: {
                    dateTime: endDate.toISOString(),
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

/**
 *  Goal - get all the applicants info who have been sent interview invites
 *  
 *  input url -  /api/v1/recruiter/:recruiterId/interviews/scheduled-applicants
 *   Req - Get
 */
const getScheduledApplicanIds = async (req, res) => {
    const { recruiterId } = req.params;

    console.log("--Id", recruiterId);


    const info = await ScheduledInterviewModel.find({ recruiter: recruiterId })
    console.log("Info", info);
    console.log("Length", info.length);

    const applicantInfo = info.map(item => item.applicant.toString());
    console.log("Applicant Info ", applicantInfo);
    res.status(200).json({
        status: true,
        applicantIds: applicantInfo  // 🔁 MUST be `applicantIds`
    });

}

/**
 * Goal to find {
 * 
  "applicantId": "123", 1
  "applicantName": "John Doe",
  "jobId": "789",1
  "meetingType": "Google Meet",1
  "location": "https://meet.google.com/xyz-abc",1
  "notes": "Bring your portfolio",1
  "dateTime": "2025-06-20T10:00:00Z",1
  "endTime": "2025-06-20T10:30:00Z"

  input url -  /api/v1/recruiter/:recruiterId/interviews/scheduled-info

  Req - Get
}

 */
const getScheduledInformation = async (req, res) => {
    const { recruiterId } = req.params;

    try {
        console.log("\n🔍 Recruiter ID:", recruiterId);

        // Fetch scheduled interviews for this recruiter
        const interviewInfo = await ScheduledInterviewModel.find({ recruiter: recruiterId });

        if (!interviewInfo || interviewInfo.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No interviews scheduled for this recruiter.",
                data: [],
            });
        }

        // Format interview data
        const vals = interviewInfo.map(info => ({
            applicantId: info?.applicant.toString(),
            jobId: info?.job.toString(),
            meetingType: info?.interviewType,
            location: info?.interviewLink,
            notes: info?.notes || "",
            startTime: info?.dateTime,
        }));

        // Fetch applicant names
        const applicantIds = interviewInfo.map(info => info.applicant);
        const applicants = await UserModel.find(
            { _id: { $in: applicantIds } },
            { _id: 1, name: 1 }
        );

        // Map applicantId to name
        const applicantIdToName = {};
        applicants.forEach(app => {
            applicantIdToName[app._id.toString()] = app.name;
        });

        // Merge applicant names into data
        const valsWithNames = vals.map(item => ({
            ...item,
            applicantName: applicantIdToName[item.applicantId] || "Unknown"
        }));

        // Transform for FullCalendar format
        const calendarEvents = valsWithNames.map(item => ({
            title: item.applicantName,
            start: item.startTime,
            extendedProps: {
                applicantId: item.applicantId,
                jobId: item.jobId,
                meetingType: item.meetingType,
                location: item.location,
                notes: item.notes,
            }
        }));

        return res.status(200).json({
            success: true,
            message: "Scheduled interviews fetched successfully",
            data: calendarEvents
        });

    } catch (error) {
        console.error("❌ Error fetching scheduled interview data:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching scheduled interviews",
            error: error.message
        });
    }
};


module.exports = { ScheduledInterview, getScheduledApplicanIds, getScheduledInformation };
