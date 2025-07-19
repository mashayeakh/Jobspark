
const express = require("express");
const { showRecuiterJobs, getMostPopularJobsByARecruiter, getJobsWithNoApplicantsByARecuiter, recentlyPublishedJobs, closingJobByARecruiter, applicationsInfoToRecruiter, findApplicantInfoByARecruiterJob, findAllUserAppliedToRecruiterJobs, findApplicantDetailsInfoToRecruiterJob, todaysNewApplication, findjobsByRecruiterId, fetchExpiredJobs, fethcActiveJobs, findAllUserAppliedToRecruiterJobs2 } = require("../../Controller/RecruiterController/RecruiterJobsController");
const { dailyActivity, getDailyActivity, getAppPerHour, getCategoryWiseApplications } = require("../../Controller/RecruiterController/RecruiterActivityController");
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

router.get("/recruiter/:recruiterId/applicants", findAllUserAppliedToRecruiterJobs2);

router.get("/recruiter/:recruiterId/applicant/:applicantId/job/:jobId", findApplicantDetailsInfoToRecruiterJob);
router.get("/today/recruiter/:recruiterId", todaysNewApplication);
router.get("/jobs/recruiter/:recruiterId", findjobsByRecruiterId);
router.get("/activeJobs/:recruiterId", fethcActiveJobs);
router.get("/expiredJobs/:recruiterId", fetchExpiredJobs);
router.get("/recruiter/:recruiterId/daily-activity", getDailyActivity);
router.get("/recruiter/:recruiterId/apps-perHour", getAppPerHour);
router.get("/recruiter/:recruiterId/categorywise-App", getCategoryWiseApplications);


module.exports = router