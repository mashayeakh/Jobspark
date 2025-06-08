const express = require("express");
const { test, shortListing } = require("../../Controller/RecruiterController/RecruiterActivityController");

const router = express.Router();



router.get("/test", test)
router.post("/recruiter/:recruiterId/applicant/:applicantId", shortListing);





module.exports = router