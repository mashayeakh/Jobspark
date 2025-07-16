const express = require("express");
const { aiRecommendJobs } = require("../../Controller/AiBasedController/AiJobsController");
const router = express().router;


router.get("/recommend-jobs/:userId", aiRecommendJobs);

module.exports = router;