const NotificationModel = require("../../Model/NotificatonModel/NotificationModel");
const { default: mongoose } = require("mongoose");
const ScheduledInterviewModel = require("../../Model/RecruiterModel/ScheduledInterviewModel");
const dayjs = require('dayjs');


/**
 * goal - create a new notifiction
 * 
 * input url -   input url -  /api/v1/recruiter/:recruiterId/notifications
 *
 * Req - post
 */
const createNotification = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const { message, type } = req.body;

        // Validate recruiterId
        if (!recruiterId) {
            return res.status(400).json({ error: "Recruiter ID is required." });
        }

        // Validate message and type
        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ error: "Notification message is required and must be a non-empty string." });
        }
        if (!type || typeof type !== "string" || !type.trim()) {
            return res.status(400).json({ error: "Notification type is required and must be a non-empty string." });
        }

        const notification = new NotificationModel({
            userId: recruiterId,
            message: message.trim(),
            type: type.trim()
        });

        const result = await notification.save();
        res.status(201).json(result);
    } catch (error) {
        console.error("Error from creating notification:", error);
        res.status(500).json({ error: "Failed to create notification." });
    }
}


/**
 * goal - get all the created notifiction
 * 
 * input url -   input url -  /api/v1/recruiter/:recruiterId/all-notifications
 *
 * Req - post
 */
const getAllTheNotifications = async (req, res) => {
    try {
        const { recruiterId } = req.params;

        // Validate recruiterId
        if (!recruiterId) {
            return res.status(400).json({ error: "Recruiter ID is required." });
        }

        const allNotifications = await NotificationModel.find({ userId: recruiterId });

        // Optionally, check if notifications exist
        if (!allNotifications || allNotifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this recruiter." });
        }

        console.log("\n\n==>All Notifications ", allNotifications);
        console.log("length", allNotifications.length);


        res.status(200).json(allNotifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications." });
    }
}

/**
 * Goal - fetch deails on clicking specific applicant
 * 
 * input url - /api/v1/recruiter/:recruiterId/applicant/:applicantId/details
 * 
 * Req - get
 */

const getDetailsOnApplicant = async (req, res) => {
    try {
        const { recruiterId, applicantId } = req.params;

        // Validate recruiterId and applicantId
        if (!recruiterId) {
            return res.status(400).json({ error: "Recruiter ID is required." });
        }
        if (!applicantId) {
            return res.status(400).json({ error: "Applicant ID is required." });
        }

        const interviewDetails = await ScheduledInterviewModel.find({ applicant: applicantId })
            .populate([
                { path: 'job', select: 'jobTitle location' },
                { path: 'applicant', select: 'name' },
                { path: 'recruiter', select: 'name' }
            ])
            .select('interviewType dateTime notes interviewLink createdAt');

        if (!interviewDetails || interviewDetails.length === 0) {
            return res.status(404).json({ message: "No interview details found for this applicant." });
        }

        const formattedDetails = interviewDetails.map((interview) => {
            return {
                Date: dayjs(interview.createdAt).format('MMMM D, YYYY, h:mm A'),
                Type: interview.interviewType || 'Interview Alert',
                Candidate: interview.applicant?.name || 'N/A',
                'Interview Date': dayjs(interview.dateTime).format('MMMM D, YYYY, h:mm A'),
                Location: interview.job?.location || 'N/A',
                Interviewer: interview.recruiter?.name || 'N/A',
                Notes: interview.notes || '',
                InterviewLink: interview.interviewLink || '',
            };
        });

        res.status(200).json(formattedDetails);
    } catch (error) {
        console.error("Error fetching applicant details:", error);
        res.status(500).json({ error: "Failed to fetch applicant details." });
    }
}

/**
 * goal - mark read the notifiction
 * 
 * input url -   input url -  /api/v1/recruiter:id/mark-read
 *
 * Req - post
 */
const markTheNotifications = async (req, res) => {

    console.log("✅ Backend: markTheNotifications called"); // Add this

    try {
        const { id } = req.params;

        // Validate id
        if (!id) {
            return res.status(400).json({ error: "ID is required." });
        }

        const result = await NotificationModel.updateMany(
            { userId: new mongoose.Types.ObjectId(id), isRead: false },
            { $set: { isRead: true } }
        );

        console.log("Matched:", result.matchedCount, "Modified:", result.modifiedCount);


        res.status(200).json({ success: true, message: "Notifications marked as read", modifiedCount: result.modifiedCount });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ error: "Failed to mark notifications as read." });
    }
}

module.exports = { createNotification, getAllTheNotifications, markTheNotifications, getDetailsOnApplicant }