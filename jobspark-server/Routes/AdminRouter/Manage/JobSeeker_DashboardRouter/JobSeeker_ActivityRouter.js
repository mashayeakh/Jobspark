const express = require("express");
const { jobSeekerActivity, getInactiveSeekers } = require("../../../../Controller/AdminController/Mange/JobSeeker/Activity/ActivityTracking");

const router = express.Router();

router.get("/jobseeker/activity", jobSeekerActivity);
router.get("/jobseeker/inactivity", getInactiveSeekers);

module.exports = router;