//! This page contains the code of Notification sending from Admin to job seeker and recruiter.

const AdminNotificationModel = require("../../../../Model/NotificatonModel/AdminNotificationModel");

//send notification to job seeker
//req - Post - admin/send-notification/job-seeker/{jobSeekerId}

const sendAdminNotification = async (req, res) => {
    const { message, type } = req.body;
    const { jobSeekerId } = req.params;

    console.log("Body ", message, type);
    console.log("Job Seeker", jobSeekerId);

    // Check session to confirm admin ID is set
    const adminId = req.session.adminId;
    console.log("Admin ID from session: ", adminId); // Log the adminId

    if (!adminId) {
        return res.status(401).send("Admin is not authenticated.");
    }

    // Check if notification already exists
    const existingNotification = await AdminNotificationModel.findOne({
        message,
        type,
        senderId: adminId,
        recipientId: jobSeekerId,
    });

    if (existingNotification) {
        return res.status(409).json({
            success: false,
            message: "Notification has already been sent to this user.",
        });
    }

    // Create the new notification
    const notification = new AdminNotificationModel({
        message,
        type,
        senderId: adminId,  // Use session's adminId
        recipientId: jobSeekerId,
    });

    console.log("Notification ", notification);

    // Save the notification to the database
    const savedNotification = await notification.save();

    console.log("Saved notification ", savedNotification);

    res.send("Notification sent successfully.");
};



module.exports = { sendAdminNotification }