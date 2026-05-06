const express = require("express");
const { createNotification, getAllTheNotifications, markTheNotifications, getDetailsOnApplicant, createJobSeekerNotification, getAllJobSeekerNotifications, getAllNotificationsForJobSeeker, markNotificationAsRead } = require("../../Controller/NotificationController/Notification");
const router = express.Router();


router.get("/recruiter/:recruiterId/all-notifications", getAllTheNotifications);
router.get("/jobSeeker/:jobSeekerId/all-notifications", getAllJobSeekerNotifications);
router.post("/recruiter/:recruiterId/notifications", createNotification);
router.post("/jobseeker/:jobSeekerId/notifications", createJobSeekerNotification);
router.post("/recruiter/:id/mark-read", markTheNotifications);
router.get("/recruiter/:recruiterId/applicant/:applicantId/details", getDetailsOnApplicant);
router.get("/jobseeker/notification/:userId", getAllNotificationsForJobSeeker);
// router.patch("/notification/:id/mark-read", getAllNotificationsForJobSeeker);
router.patch("/jobseeker/notification/mark-as-read/:id", markNotificationAsRead);


module.exports = router;