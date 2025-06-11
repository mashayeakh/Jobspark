const express = require("express");
const { test, shortListing, getRecruiterStatus } = require("../../Controller/RecruiterController/RecruiterActivityController");

const router = express.Router();



router.get("/test", test)
router.post("/recruiter/:recruiterId/applicant/:applicantId", shortListing);
router.get("/recruiter/:recruiterId/applicant/:applicantId/status", getRecruiterStatus);





module.exports = router