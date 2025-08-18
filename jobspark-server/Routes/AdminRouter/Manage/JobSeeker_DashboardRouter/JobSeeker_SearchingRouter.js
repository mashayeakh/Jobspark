const express = require("express");
const { allInfo } = require("../../../../Controller/AdminController/Mange/JobSeeker/Search/Search");

const router = express.Router();

router.get("/jobseeker/search/allInfo", allInfo);

module.exports = router;