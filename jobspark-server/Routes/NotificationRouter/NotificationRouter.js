const express = require("express");
const { createNotification, getAllTheNotifications, markTheNotifications, getDetailsOnApplicant, createJobSeekerNotification, getAllJobSeekerNotifications } = require("../../Controller/NotificationController/Notification");
const router = express.Router();


router.get("/recruiter/:recruiterId/all-notifications", getAllTheNotifications);
router.get("/jobSeeker/:jobSeekerId/all-notifications", getAllJobSeekerNotifications);
router.post("/recruiter/:recruiterId/notifications", createNotification);
router.post("/jobseeker/:jobSeekerId/notifications", createJobSeekerNotification);
router.post("/recruiter/:id/mark-read", markTheNotifications);
router.get("/recruiter/:recruiterId/applicant/:applicantId/details", getDetailsOnApplicant);

module.exports = router;