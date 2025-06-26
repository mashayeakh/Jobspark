const express = require("express");
const { searchJobs } = require("../../Controller/FilterController/FilterController");



const router = express.Router();

router.get('/jobs/search', searchJobs);

module.exports = router 