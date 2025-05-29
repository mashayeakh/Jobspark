
const express = require("express");
const { showRecuiterJobs } = require("../../Controller/RecruiterController/RecruiterJobsController");

const router = express.Router();


router.get("/job/recruiter", showRecuiterJobs);

// router.get("/job/recruiter", showRecruiterJobs);

module.exports = router