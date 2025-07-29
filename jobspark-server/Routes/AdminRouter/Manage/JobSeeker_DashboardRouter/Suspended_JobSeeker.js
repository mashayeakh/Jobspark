const express = require("express");
const { getIncompleteProfiles } = require("../../../../Controller/AdminController/Mange/JobSeeker/All/SuspenedJobSeeker");
const router = express.Router();


router.get("/job-seeker/all/incomplete", getIncompleteProfiles);


module.exports = router;