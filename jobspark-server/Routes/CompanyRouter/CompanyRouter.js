const express = require("express");
const { createCompanyProfile, getAllCompanies } = require("../../Controller/CompanyController/CompanyController");


const router = express.Router();

router.post("/company/create", createCompanyProfile)
router.get("/companies", getAllCompanies)

module.exports = router 