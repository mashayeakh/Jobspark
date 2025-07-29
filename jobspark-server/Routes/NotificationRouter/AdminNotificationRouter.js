const express = require("express");
const { sendAdminNotification } = require("../../Controller/AdminController/Mange/AdminNotification/AdminNotificationController");

const router = express.Router();


router.post("/send-notification/job-seeker/:jobSeekerId", sendAdminNotification);


module.exports = router;