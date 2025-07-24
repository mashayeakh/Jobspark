const express = require("express");
const { admin_dashboardStats, admin_JobSeekersQuickStats, admin_RecruitersQuickStats } = require("../../Controller/AdminController/Admin_DashboardController");
const router = express.Router();

router.get("/dashboard/stats", admin_dashboardStats);
router.get("/dashboard/job-seekers/quick-stats", admin_JobSeekersQuickStats);
router.get("/dashboard/recruiter/quick-stats", admin_RecruitersQuickStats);



module.exports = router;