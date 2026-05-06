const express = require("express");
const { quickStats, getJobSeekerOverviewStats, countCompleteProfiles, getCompletedProfileStats } = require("../../../../Controller/AdminController/Mange/JobSeeker/All/ActiveJobSeekers");
const { activeProfiles } = require("../../../../Controller/AdminController/Mange/JobSeeker/Activity/ActivityTracking");
const router = express.Router();


router.get("/jobseeker/all/overview-stats", getJobSeekerOverviewStats);
router.get("/jobseeker/all/completeness", getCompletedProfileStats);
// router.get("/jobseeker/all/activeProfiles", activeProfiles);


module.exports = router 