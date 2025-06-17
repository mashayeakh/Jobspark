const express = require("express");
const { createNotification, getAllTheNotifications, markTheNotifications } = require("../../Controller/NotificationController/Notification");
const router = express.Router();


router.get("/recruiter/:recruiterId/all-notifications", getAllTheNotifications);
router.post("/recruiter/:recruiterId/notifications", createNotification);
router.patch("/:id/mark-read", markTheNotifications);

module.exports = router;