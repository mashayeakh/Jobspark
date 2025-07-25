const express = require("express");
const { recruiterActivityBar } = require("../../../Controller/AdminController/Admin_DashboardGraphs/RecruiterActivityBar");

const router = express.Router();


router.get("/dashboard/recruiter-activity-trends", recruiterActivityBar);



module.exports = router;