const express = require("express");
const { quickStats, getJobSeekerOverviewStats, countCompleteProfiles, getCompletedProfileStats } = require("../../../../Controller/AdminController/Mange/JobSeeker/All/ActiveJobSeekers");
const router = express.Router();


router.get("/jobseeker/all/overview-stats", getJobSeekerOverviewStats);
router.get("/jobseeker/all/completeness", getCompletedProfileStats);


module.exports = router 