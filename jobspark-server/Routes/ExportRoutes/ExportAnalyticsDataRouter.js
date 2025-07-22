const express = require("express");
const { analyticsData } = require("../../Controller/ExportController/AnalyticsData/ExportAnalyticsData");

const router = express.Router();

router.get("/recruiter/:recruiterId/analytics-data", analyticsData);

module.exports = router;