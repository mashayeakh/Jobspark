const express = require("express");
const { getIncompleteProfiles, getIncompleteProfilesWithNotifications } = require("../../../../Controller/AdminController/Mange/JobSeeker/All/SuspenedJobSeeker");
const router = express.Router();


router.get("/job-seeker/all/incomplete", getIncompleteProfiles);
router.get("/job-seeker/all/incomplete-with-notification", getIncompleteProfilesWithNotifications);


module.exports = router;