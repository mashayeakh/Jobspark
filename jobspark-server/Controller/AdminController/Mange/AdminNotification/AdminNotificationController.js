//! This page contains the code of Notification sending from Admin to job seeker and recruiter.

const UserModel = require("../../../../Model/AccountModel/UserModel");
const AdminNotificationModel = require("../../../../Model/NotificatonModel/AdminNotificationModel");

//send notification to job seeker
//req - Post - admin/send-notification/job-seeker/{jobSeekerId}

const sendAdminNotification = async (req, res) => {
    try {
        const { message, type } = req.body;
        const { jobSeekerId } = req.params;



        console.log("Message , type ", message, type);


        // Validate input
        if (!message || !type || !jobSeekerId) {
            return res.status(400).json({
                success: false,
                message: "Message, type, and jobSeekerId are required.",
            });
        }

        // Get adminId from session
        const adminId = req.session.adminId;
        console.log("ADmin ind ", adminId);
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Admin is not authenticated.",
            });
        }

        // Check if notification already exists
        const existingNotification = await AdminNotificationModel.findOne({
            type,
            senderId: adminId,
            recipientId: jobSeekerId,
            message: message ? message.trim() : undefined, // optional
        });

        if (existingNotification) {
            return res.status(409).json({
                success: false,
                message: "Notification has already been sent to this user.",
            });
        }

        // Create and save new notification
        const notification = new AdminNotificationModel({
            message,
            type,
            senderId: adminId,
            recipientId: jobSeekerId,
        });

        const savedNotification = await notification.save();

        return res.status(201).json({
            success: true,
            message: "Notification sent successfully.",
            data: savedNotification,
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            console.error("Error sending notification:", error);
            return res.status(400).json({ success: false, message: error.message });
        }
        console.error("Error sending notification:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the notification.",
            error: error.message,
        });
    }
};

//get notification type
// req- get- admin/get-notification/job-seeker/{jobSeekerId}
const getSentNotificationTypes = async (req, res) => {
    const { jobSeekerId } = req.params;

    try {
        const types = await AdminNotificationModel.find({ recipientId: jobSeekerId }).distinct("type");
        res.status(200).json({ success: true, types });
    } catch (error) {
        console.error("Error fetching sent types:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


//get notifiled job seekrs info
//req - get - notified-jobseekers
const getNotifiedJobSeekers = async (req, res) => {
    try {
        // Step 1: Get all job seekers
        const jobSeekers = await UserModel.find({ role: "job_seeker" }).select("name email");

        // Step 2: For each job seeker, get their notification history
        const response = await Promise.all(
            jobSeekers.map(async (user) => {
                const notifications = await AdminNotificationModel.find({ receiver: user._id })
                    .sort({ createdAt: -1 })
                    .select("type message createdAt");

                return {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    notifications,
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: response.length,
            data: response
        });
    } catch (err) {
        console.error("Error fetching notified users:", err);
        return res.status(500).json({ error: "Failed to load notified users." });
    }
};




module.exports = { sendAdminNotification, getSentNotificationTypes, getNotifiedJobSeekers }