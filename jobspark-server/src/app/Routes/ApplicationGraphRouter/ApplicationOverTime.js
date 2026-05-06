const express = require("express");
const { getApplicationsOverTime } = require("../../Controller/ApplicationGraphController/ApplicationOverTime");
const router = express.Router();


router.get("/recruiter/:recruiterId/application/over-time", getApplicationsOverTime);


module.exports = router;