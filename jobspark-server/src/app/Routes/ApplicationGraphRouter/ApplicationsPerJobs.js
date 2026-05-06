const express = require("express");
const { getApplicationsPerJobs } = require("../../Controller/ApplicationGraphController/ApplicationsPerJobs");
const router = express.Router();

router.get("/recruiter/:recruiterId/job-wise-applications", getApplicationsPerJobs);


module.exports = router;