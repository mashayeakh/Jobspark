const express = require("express");
const { createActiveJobs, showActiveJobs, findActiveJobsById } = require("../../Controller/RecruiterController/ActiveJobsController");
const router = express.Router();
// const { createActiveJobs } = require("../../Controller/RecruiterController/ActiveJobsController");



router.post("/job", createActiveJobs);
router.get("/", showActiveJobs);
router.get("/:id", findActiveJobsById);
// router.get("/:id", findActiveJobsById);


module.exports = router