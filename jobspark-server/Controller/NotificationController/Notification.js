const NotificationModel = require("../../Model/NotificatonModel/NotificationModel");

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

        res.status(200).json(allNotifications);
    } catch (error) {
        console.error("Error from fetching notifications:", error);
        res.status(500).json({ error: "Failed to fetch notifications." });
    }
}

/**
 * goal - mark read the notifiction
 * 
 * input url -   input url -  /api/v1/:id/mark-read
 *
 * Req - patch
 */
const markTheNotifications = async (req, res) => {

}

module.exports = { createNotification, getAllTheNotifications, markTheNotifications }