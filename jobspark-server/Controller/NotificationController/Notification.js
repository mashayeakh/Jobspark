const NotificationModel = require("../../Model/NotificatonModel/NotificationModel");
const { default: mongoose } = require("mongoose");
const ScheduledInterviewModel = require("../../Model/RecruiterModel/ScheduledInterviewModel");
const dayjs = require('dayjs');
const AdminNotificationModel = require("../../Model/NotificatonModel/AdminNotificationModel");


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
const createJobSeekerNotification = async (req, res) => {
    try {
        const { jobSeekerId } = req.params;
        const { message, type } = req.body;

        if (!jobSeekerId || !message || !type) {
            return res.status(400).json({ error: "Job Seeker ID, message, and type are required." });
        }

        // ✅ Check if similar notification exists
        const existingNotification = await NotificationModel.findOne({
            userId: jobSeekerId,
            message: message.trim(),
            type: type.trim()
        });

        if (existingNotification) {
            // ✅ Update timesIgnored instead of duplicating
            existingNotification.timesIgnored = (existingNotification.timesIgnored || 1) + 1;
            const updated = await existingNotification.save();
            return res.status(200).json({
                message: "Existing notification updated.",
                data: updated
            });
        }

        // ✅ Create new notification if not found
        const notification = new NotificationModel({
            userId: jobSeekerId,
            message: message.trim(),
            type: type.trim(),
            timesIgnored: 1
        });

        const result = await notification.save();
        res.status(201).json(result);

    } catch (error) {
        console.error("Error from creating job seeker notification:", error);
        res.status(500).json({ error: "Failed to create job seeker notification." });
    }
};


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

const getAllJobSeekerNotifications = async (req, res) => {
    try {
        const { jobSeekerId } = req.params;

        if (!jobSeekerId) {
            return res.status(400).json({ error: "Job Seeker ID is required." });
        }

        const allNotifications = await NotificationModel.find({ userId: jobSeekerId });

        if (!allNotifications || allNotifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this job seeker." });
        }

        console.log("Job Seeker Notifications:", allNotifications);
        res.status(200).json(allNotifications);
    } catch (error) {
        console.error("Error fetching job seeker notifications:", error);
        res.status(500).json({ error: "Failed to fetch job seeker notifications." });
    }
};


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


//* fetch notification both notificatino model and admin notificaitonmodel
// get - jobseeker/notification/:userId

const getAllNotificationsForJobSeeker = async (req, res) => {
    const { userId } = req.params;

    try {
        // 1. System notifications
        const systemNotifications = await NotificationModel.find({ userId })
            .lean()
            .sort({ createdAt: -1 });


        // Add source to each
        const formattedSystem = systemNotifications.map(n => ({
            ...n,
            source: 'system',
        }));

        // 2. Admin notifications
        const adminNotifications = await AdminNotificationModel.find({ recipientId: userId })
            .lean()
            .sort({ timestamp: -1 });

        const formattedAdmin = adminNotifications.map(n => ({
            _id: n._id,
            message: n.message,
            type: n.type,
            status: n.status,
            createdAt: n.timestamp,
            source: 'admin',
        }));

        // 3. Combine and sort all
        const allNotifications = [...formattedSystem, ...formattedAdmin].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({
            success: true,
            data: allNotifications
        });
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications'
        });
    }
};

//mark the notificaiton as read
// PATCH /api/v1/notifications/:id/mark-read
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    const { type, userId } = req.query;

    try {
        let notification;

        if (type === "system") {
            notification = await NotificationModel.findById(id);
        } else if (type === "admin") {
            notification = await AdminNotificationModel.findById(id);
        } else {
            return res.status(400).json({ success: false, message: "Invalid type" });
        }

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        // Use correct user ID field based on type
        const recipientField = type === "system" ? notification.userId : notification.recipientId;

        if (recipientField?.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    } catch (err) {
        console.error("Error marking notification as read", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};





module.exports = { createNotification, getAllTheNotifications, markTheNotifications, getDetailsOnApplicant, createJobSeekerNotification, getAllJobSeekerNotifications, getAllNotificationsForJobSeeker, markNotificationAsRead }