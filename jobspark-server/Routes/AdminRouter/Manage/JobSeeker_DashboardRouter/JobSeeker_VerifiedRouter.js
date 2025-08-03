const express = require("express");
const { getVerifiedStats } = require("../../../../Controller/AdminController/Mange/JobSeeker/All/VerifiedJobSeeker");
const router = express.Router();


router.get("/all/verified-jobseeker", getVerifiedStats);




module.exports = router;