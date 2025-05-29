
const express = require("express");
const { createActiveJobs, showActiveJobs, findActiveJobsById, showRecruiterJobs } = require("../../Controller/JobsController/ActiveJobsController");
const { showRecuiterJobs } = require("../../Controller/RecruiterController/RecruiterJobsController");
const router = express.Router();
// const { createActiveJobs } = require("../../Controller/RecruiterController/ActiveJobsController");



router.post("/job", createActiveJobs);
router.get("/", showActiveJobs);
router.get("/:id", findActiveJobsById);
// router.get("/job/recruiter", showRecuiterJobs);
// router.get("/job/recruiter", showRecruiterJobs);

module.exports = router