const express = require("express");
const { exportActiveJobs } = require("../../Controller/ExportController/ActiveJobs/ExportActiveJobs");
const router = express.Router();

router.get("/recruiter/:recruiterId/active-jobs", exportActiveJobs);


module.exports = router;