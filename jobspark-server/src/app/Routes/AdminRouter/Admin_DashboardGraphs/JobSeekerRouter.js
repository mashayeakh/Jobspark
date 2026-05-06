const express = require("express");
const { jobSeekerActivityBar } = require("../../../Controller/AdminController/Admin_DashboardGraphs/JobSeekerActivityBar");

const router = express.Router();

router.get("/dashboard/job-seekers/activity-trends", jobSeekerActivityBar);


module.exports = router;