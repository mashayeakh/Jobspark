const express = require("express");
const { ScheduledInterview, getScheduledApplicanIds, getScheduledInformation } = require("../../Controller/RecruiterController/InterviewController");
const router = express.Router();


router.post("/recruiter/:recruiterId/interviews/schedule", ScheduledInterview)
router.get("/recruiter/:recruiterId/interviews/scheduled-applicants", getScheduledApplicanIds)
router.get("/recruiter/:recruiterId/interviews/scheduled-info", getScheduledInformation)

module.exports = router