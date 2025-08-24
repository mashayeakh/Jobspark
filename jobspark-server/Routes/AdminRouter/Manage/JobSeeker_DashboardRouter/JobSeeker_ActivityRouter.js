const express = require("express");
const { jobSeekerActivity, getInactiveSeekers, getDailyActiveSeekers, topSkills, getExperienceLevel, getLocations, popularJobCategories, activeProfiles, allLoc, exportCsv, exportPdf } = require("../../../../Controller/AdminController/Mange/JobSeeker/Activity/ActivityTracking");

const router = express.Router();

router.get("/jobseeker/activity", jobSeekerActivity);
router.get("/jobseeker/inactivity", getInactiveSeekers);
router.get("/jobseeker/daily", getDailyActiveSeekers);
router.get("/jobseeker/top-skills", topSkills);
router.get("/jobseeker/experience-level", getExperienceLevel);
router.get("/jobseeker/locations", getLocations);
router.get("/jobseeker/popular-job-categories", popularJobCategories);
router.get("/jobseeker/activeProfiles", activeProfiles);
router.get("/jobseeker/exports/csv", exportCsv);
router.get("/jobseeker/exports/pdf", exportPdf);
router.get("/jobseeker/allLoc", allLoc);

module.exports = router;