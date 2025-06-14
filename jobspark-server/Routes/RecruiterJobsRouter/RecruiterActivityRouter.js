const express = require("express");
const { test, shortListing, getRecruiterStatus, getNumOfStatus, getShortlistedCandidates } = require("../../Controller/RecruiterController/RecruiterActivityController");

const router = express.Router();



router.get("/test", test)
router.post("/recruiter/:recruiterId/applicant/:applicantId", shortListing);
router.get("/recruiter/:recruiterId/applicant/:applicantId/job/:jobId/status", getRecruiterStatus);
router.get("/recruiter/:recruiterId/numOfStatus", getNumOfStatus);
router.get("/recruiter/:recruiterId/shortlisted-Candidates", getShortlistedCandidates);





module.exports = router