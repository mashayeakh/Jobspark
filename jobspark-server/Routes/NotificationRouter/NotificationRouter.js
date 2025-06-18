const express = require("express");
const { createNotification, getAllTheNotifications, markTheNotifications, getDetailsOnApplicant } = require("../../Controller/NotificationController/Notification");
const router = express.Router();


router.get("/recruiter/:recruiterId/all-notifications", getAllTheNotifications);
router.post("/recruiter/:recruiterId/notifications", createNotification);
router.post("/recruiter/:id/mark-read", markTheNotifications);
router.get("/recruiter/:recruiterId/applicant/:applicantId/details", getDetailsOnApplicant);

module.exports = router;