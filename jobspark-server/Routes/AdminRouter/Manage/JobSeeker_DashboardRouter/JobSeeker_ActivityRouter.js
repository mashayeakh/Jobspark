const express = require("express");
const { jobSeekerActivity } = require("../../../../Controller/AdminController/Mange/JobSeeker/Activity/ActivityTracking");

const router = express.Router();

router.get("/jobseeker/activity", jobSeekerActivity);

module.exports = router;