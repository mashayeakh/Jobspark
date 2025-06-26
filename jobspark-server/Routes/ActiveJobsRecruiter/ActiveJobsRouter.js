
const express = require("express");
const { createActiveJobs, showActiveJobs, findActiveJobsById, showRecruiterJobs, applyToJobs, getJobsByRecruiterId, findJobsByCategory } = require("../../Controller/JobsController/ActiveJobsController");
const { showRecuiterJobs } = require("../../Controller/RecruiterController/RecruiterJobsController");
const router = express.Router();
// const { createActiveJobs } = require("../../Controller/RecruiterController/ActiveJobsController");



router.post("/job", createActiveJobs);
router.get("/", showActiveJobs);
router.get("/job/:id", findActiveJobsById);
router.post("/apply/job/:currentJobId", applyToJobs);
router.get("/recruiter", getJobsByRecruiterId);
router.get("/category/:categoryName", findJobsByCategory);


module.exports = router