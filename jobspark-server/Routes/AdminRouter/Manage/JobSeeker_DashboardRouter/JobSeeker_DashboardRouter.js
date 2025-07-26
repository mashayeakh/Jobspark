const express = require("express");
const { totalJobSeekers, activeProfile, newRegistration, profileCompletion, skillsDistribution, getTopSkills, topLocation, top_job_categories } = require("../../../../Controller/AdminController/Mange/JobSeeker/Dashboard/JobSeeker_Dashboard");
const router = express.Router();

router.get("/jobseeker/dashboard/total_job_seeker", totalJobSeekers);
router.get("/jobseeker/dashboard/active_profile", activeProfile);
router.get("/jobseeker/dashboard/new_Registration", newRegistration);
router.get("/jobseeker/dashboard/profile_completion", profileCompletion);
router.get("/jobseeker/dashboard/skills_distribution", skillsDistribution);
router.get("/jobseeker/dashboard/top_skills", getTopSkills);
router.get("/jobseeker/dashboard/top_location", topLocation);
router.get("/jobseeker/dashboard/top_job_categories", top_job_categories);

module.exports = router;