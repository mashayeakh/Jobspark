const express = require("express");
const { sendAdminNotification, getSentNotificationTypes, getNotifiedJobSeekers, sendVerificationReminder } = require("../../Controller/AdminController/Mange/AdminNotification/AdminNotificationController");

const router = express.Router();


router.post("/send-notification/job-seeker/:jobSeekerId", sendAdminNotification);
router.post("/get-notification/job-seeker/:jobSeekerId", getSentNotificationTypes);
router.post("/notified-jobseekers", getNotifiedJobSeekers);
router.post("/verification-remainder/:jobSeekerId", sendVerificationReminder);


module.exports = router;