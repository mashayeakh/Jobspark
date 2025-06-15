const express = require("express");
const { ScheduledInterview, getScheduledApplicanIds } = require("../../Controller/RecruiterController/InterviewController");
const router = express.Router();


router.post("/recruiter/:recruiterId/interviews/schedule", ScheduledInterview)
router.get("/recruiter/:recruiterId/interviews/scheduled-applicants", getScheduledApplicanIds)

module.exports = router