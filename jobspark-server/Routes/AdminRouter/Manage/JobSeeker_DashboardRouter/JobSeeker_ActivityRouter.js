const express = require("express");
const { jobSeekerActivity, getInactiveSeekers, getDailyActiveSeekers, topSkills, getExperienceLevel } = require("../../../../Controller/AdminController/Mange/JobSeeker/Activity/ActivityTracking");

const router = express.Router();

router.get("/jobseeker/activity", jobSeekerActivity);
router.get("/jobseeker/inactivity", getInactiveSeekers);
router.get("/jobseeker/daily", getDailyActiveSeekers);
router.get("/jobseeker/top-skills", topSkills);
router.get("/jobseeker/experience-level", getExperienceLevel);

module.exports = router;