const express = require("express");
const { exportTotalApplication } = require("../../Controller/ExportController/TotalApplication/ExportTotalApplication");

const router = express.Router();

router.get("/recruiter/:recruiterId/total-application/export", exportTotalApplication);

module.exports = router; 
