const express = require("express");
const { createCompanyProfile } = require("../../Controller/CompanyController/CompanyController");


const router = express.Router();

router.post("/company/create", createCompanyProfile)

module.exports = router 