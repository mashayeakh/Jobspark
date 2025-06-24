const express = require("express");
const { createCompanyProfile, getAllCompanies, findCompanyById, getCompanyProfileWithJobs } = require("../../Controller/CompanyController/CompanyController");


const router = express.Router();

router.post("/recruiter/:recruiterId/company/create", createCompanyProfile)
router.get("/companies", getAllCompanies)
router.get("/company/:companyId", findCompanyById)
router.get('/recruiter/:recruiterId/company/:companyId', getCompanyProfileWithJobs);

module.exports = router 