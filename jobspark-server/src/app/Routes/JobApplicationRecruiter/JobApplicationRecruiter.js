const express = require("express");
const { hasUserApplied } = require("../../Controller/JobsController/JobApplicationController");

const router = express.Router();

router.get("/check-application", hasUserApplied)

module.exports = router 