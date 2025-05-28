const express = require("express");
const { createActiveJobs } = require("../../Controller/RecruiterController/ActiveJobsController");
const router = express.Router();
// const { createActiveJobs } = require("../../Controller/RecruiterController/ActiveJobsController");



router.post("/job", createActiveJobs);

module.exports = router