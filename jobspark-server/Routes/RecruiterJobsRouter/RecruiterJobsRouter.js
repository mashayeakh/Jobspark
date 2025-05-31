
const express = require("express");
const { showRecuiterJobs, getMostPopularJobsByARecruiter } = require("../../Controller/RecruiterController/RecruiterJobsController");

const router = express.Router();


router.get("/job/recruiter", showRecuiterJobs);
router.get("/recruiter/:recruiterId/popular-jobs", getMostPopularJobsByARecruiter);

// router.get("/job/recruiter", showRecruiterJobs);

module.exports = router