
const express = require("express");
const { showRecuiterJobs, getMostPopularJobsByARecruiter, getJobsWithNoApplicantsByARecuiter, recentlyPublishedJobs, closingJobByARecruiter, applicationsInfoToRecruiter, findApplicantInfoByARecruiterJob, findAllUserAppliedToRecruiterJobs, findApplicantDetailsInfoToRecruiterJob, todaysNewApplication, findjobsByRecruiterId, fetchExpiredJobs, fethcActiveJobs } = require("../../Controller/RecruiterController/RecruiterJobsController");
findApplicantDetailsInfoToRecruiterJob
const router = express.Router();


router.get("/job/recruiter", showRecuiterJobs);
router.get("/recruiter/:recruiterId/popular-jobs", getMostPopularJobsByARecruiter);
router.get("/recruiter/:recruiterId/no-jobs", getJobsWithNoApplicantsByARecuiter);
router.get("/recruiter/:recruiterId/recent-jobs", recentlyPublishedJobs);
router.get("/recruiter/:recruiterId/closing-jobs", closingJobByARecruiter);
router.get("/recruiter/:recruiterId/all-applications", applicationsInfoToRecruiter);
router.get("/recruiter/:recruiterId/user/:userId", findApplicantInfoByARecruiterJob);
router.get("/recruiter/:recruiterId/all-applicants-info", findAllUserAppliedToRecruiterJobs);
router.get("/recruiter/:recruiterId/applicant/:applicantId/job/:jobId", findApplicantDetailsInfoToRecruiterJob);
router.get("/today/recruiter/:recruiterId", todaysNewApplication);
router.get("/jobs/recruiter/:recruiterId", findjobsByRecruiterId);
router.get("/activeJobs/:recruiterId", fethcActiveJobs);
router.get("/expiredJobs/:recruiterId", fetchExpiredJobs);

// router.get("/job/recruiter", showRecruiterJobs);

module.exports = router