const express = require("express");
const { ScheduledInterview } = require("../../Controller/RecruiterController/InterviewController");
const router = express.Router();


router.post("/recruiter/:recruiterId/interviews/schedule", ScheduledInterview)

module.exports = router