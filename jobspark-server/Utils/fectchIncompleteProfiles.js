const UserModel = require("../Model/AccountModel/UserModel");
const AdminNotificationModel = require("../Model/NotificatonModel/AdminNotificationModel");

const fetchIncompleteProfiles = async () => {
    try {
        const notifications = await AdminNotificationModel.find({
            type: 'profile_incomplete',
            status: 'pending',
        });

        // console.log("Nofication in utls ", notifications);

        if (notifications.length === 0) {
            console.log("✅ No pending 'profile_incomplete' notifications.");
            return [];
        }

        const usersToWarn = [];

        for (const notification of notifications) {
            const userId = notification.recipientId;
            // const userId = notification.userId;

            const user = await UserModel.findById(userId);

            if (!user) {
                console.warn(`⚠️ User with ID ${userId} not found.`);
                continue;
            }

            if (!user.jobSeekerProfile?.isProfileComplete) {
                usersToWarn.push({ user, notification });
            } else {
                console.log(`✅ ${user.email} completed profile. No warning needed.`);
            }
        }

        return usersToWarn;

    } catch (error) {
        console.error("❌ Error in fetchIncompleteProfiles:", error.message);
        return [];
    }
};

module.exports = fetchIncompleteProfiles;