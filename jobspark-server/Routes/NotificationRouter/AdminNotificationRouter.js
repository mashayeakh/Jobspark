const express = require("express");
const { sendAdminNotification, getSentNotificationTypes, getNotifiedJobSeekers } = require("../../Controller/AdminController/Mange/AdminNotification/AdminNotificationController");

const router = express.Router();


router.post("/send-notification/job-seeker/:jobSeekerId", sendAdminNotification);
router.post("/get-notification/job-seeker/:jobSeekerId", getSentNotificationTypes);
router.post("/notified-jobseekers", getNotifiedJobSeekers);


module.exports = router;