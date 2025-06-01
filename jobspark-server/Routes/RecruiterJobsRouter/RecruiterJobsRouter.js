
const express = require("express");
const { showRecuiterJobs, getMostPopularJobsByARecruiter, getJobsWithNoApplicantsByARecuiter, recentlyPublishedJobs, closingJobByARecruiter } = require("../../Controller/RecruiterController/RecruiterJobsController");

const router = express.Router();


router.get("/job/recruiter", showRecuiterJobs);
router.get("/recruiter/:recruiterId/popular-jobs", getMostPopularJobsByARecruiter);
router.get("/recruiter/:recruiterId/no-jobs", getJobsWithNoApplicantsByARecuiter);
router.get("/recruiter/:recruiterId/recent-jobs", recentlyPublishedJobs);
router.get("/recruiter/:recruiterId/closing-jobs", closingJobByARecruiter);

// router.get("/job/recruiter", showRecruiterJobs);

module.exports = router