const express = require("express");
const { getSkills } = require("../../../Controller/AdminController/Admin_DashboardGraphs/PicChart");
const router = express.Router();

router.get("/dashboard/skills-count", getSkills);

module.exports = router