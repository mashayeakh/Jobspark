const UserModel = require("../Model/AccountModel/UserModel");
const AdminNotificationModel = require("../Model/NotificatonModel/AdminNotificationModel");
const { generateProfileReminder } = require("./gemini"); // your AI message generator

async function processProfileIncompleteNotifications() {
    try {
        // Step 1: Get all pending 'profile_incomplete' notifications
        const pendingNotifications = await AdminNotificationModel.find({
            type: "profile_incomplete",
            status: "pending",
        });


        console.log("Pending Noti", pendingNotifications);
        console.log("Pending Noti", pendingNotifications.length);

        if (!pendingNotifications.length) {
            console.log("No pending profile_incomplete notifications to process.");
            return;
        }

        for (const notification of pendingNotifications) {
            const userId = notification.recipientId;

            // Step 2: Fetch user info to personalize message
            const user = await UserModel.findById(userId);
            if (!user) {
                console.log(`User not found for notification ${notification._id}`);
                continue;
            }

            // Step 3: Generate warning message using Gemini AI
            const userName = user.name || "there";
            const warningMessage = await generateProfileReminder(userName);

            // Step 4: Create new admin notification of type 'warning'
            const warningNotification = new AdminNotificationModel({
                message: warningMessage,
                recipientId: userId,
                senderId: notification.senderId, // keep same sender (admin)
                status: "pending",
                type: "warning",
                timestamp: new Date(),
            });

            await warningNotification.save();

            console.log(`Created warning notification for user ${user.email}`);

            // Optionally Step 5: update original notification if you want
            // notification.status = "processed"; // or 'sent'
            // await notification.save();
        }
    } catch (err) {
        console.error("Error in processing profile incomplete notifications:", err);
    }
}

module.exports = { processProfileIncompleteNotifications };
