const express = require("express");
const { createCompanyProfile, getAllCompanies, findCompanyById, getCompanyProfileWithJobs, companyJobDetailsByRecruiter } = require("../../Controller/CompanyController/CompanyController");


const router = express.Router();

router.post("/recruiter/:recruiterId/company/create", createCompanyProfile)
router.get("/companies", getAllCompanies)
router.get("/company/:companyId", findCompanyById)
router.get('/recruiter/:recruiterId/company/:companyId', getCompanyProfileWithJobs);
router.get('/recruiter/:recruiterId/company/:companyId/job/:jobId', companyJobDetailsByRecruiter);

module.exports = router 