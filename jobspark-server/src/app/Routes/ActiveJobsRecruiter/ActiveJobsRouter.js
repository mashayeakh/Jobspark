
const express = require("express");
const { createActiveJobs, showActiveJobs, findActiveJobsById, showRecruiterJobs, applyToJobs, getJobsByRecruiterId, findJobsByCategory } = require("../../Controller/JobsController/ActiveJobsController");
const { showRecuiterJobs } = require("../../Controller/RecruiterController/RecruiterJobsController");
const { getHotJobs, savedJobs, getSavedJobs, filterJobs } = require("../../Controller/JobsController/SortingJobsController");
const router = express.Router();
// const { createActiveJobs } = require("../../Controller/RecruiterController/ActiveJobsController");



router.post("/job", createActiveJobs);
router.get("/", showActiveJobs);
router.get("/job/:id", findActiveJobsById);
router.post("/apply/job/:currentJobId", applyToJobs);
router.get("/recruiter", getJobsByRecruiterId);
router.get("/category/:categoryName", findJobsByCategory);

router.get("/hotJobs", getHotJobs);
router.post("/user/:userId/save-jobs/:jobId", savedJobs);
router.get("/user/:userId/saved-jobs", getSavedJobs);
router.get("/search/jobs", filterJobs);


module.exports = router