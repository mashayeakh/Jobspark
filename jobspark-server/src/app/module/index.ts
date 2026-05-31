import express from "express";
import { AuthRoutes } from "./auth/auth.route";
import { JobSeekerRoutes } from "./jobSeeker/jobSeeker.route";
import { RecruiterRoutes } from "./recruiter/recruiter.route";
import { JobRoutes } from "./job/job.route";
import { ApplicationRoutes } from "./application/application.route";
import { NetworkRoutes } from "./network/network.route";
import { AdminRoutes } from "./admin/admin.route";

import { CategoryRoutes } from "./category/category.route";
import { WorkStyleRoutes } from "./workstyle/workstyle.route";
import { CompanyRoutes } from "./company/company.route";


import { ContentSanityRouter } from "./ai/content_sanity/contentSanity.route";
import { SupportAgentRouter } from "./ai/support_agent/supportAgent.route";
import { FraudDetectionRouter } from "./ai/fraud_detection/fraudDetection.route";
import { MarketIntelligenceRouter } from "./ai/market_intelligence/marketIntelligence.route";
import { AnomalyDetectionRouter } from "./ai/anomaly_detection/anomalyDetection.route";
import { ChurnPredictionRouter } from "./ai/churn_prediction/churnPrediction.route";
import { PlatformSettingsRouter } from "./ai/platform_settings/platformSettings.route";
import { JobDescriptionRouter } from "./ai/job_description/jobDescription.route";
import { BioGeneratorRouter } from "./ai/bio_generator/bioGenerator.route";
import { RecommendationRoutes } from "./ai/recommendation/recommendation.route";
import { InterviewRoutes } from "./interview/interview.route";
import { ResumeAnalyzerRoutes } from "./ai/resume_analyzer/resumeAnalyzer.route";
import { ProfileAnalyticsRoutes } from "./ai/profile_analytics/profileAnalytics.route";
import { BlogGeneratorRoutes } from "./ai/blog_generator/blogGenerator.route";
import { BlogRoutes } from "./blog/blog.route";
import { ReviewRoutes } from "./review/review.route";
import { NewsletterRoutes } from "./newsletter/newsletter.route";
import { ContactRoutes } from "./contact/contact.route";
import { PaymentRouter } from "./payment/payment.route";

const router = express.Router();

//!Auth
router.use("/auth", AuthRoutes);

//!JobSeeker
router.use("/jobseeker/recommended", RecommendationRoutes);
router.use("/jobseeker/resume-analyzer", ResumeAnalyzerRoutes);
router.use("/jobseeker/profile-analytics", ProfileAnalyticsRoutes);
router.use("/jobseeker", JobSeekerRoutes);

//!Recruiter
router.use("/recruiter", RecruiterRoutes);

//!Category
router.use("/categories", CategoryRoutes);

//!WorkStyle
router.use("/workstyles", WorkStyleRoutes);

//!Companies
router.use("/companies", CompanyRoutes);

//!Jobs
router.use("/jobs", JobRoutes);

//!Applications
router.use("/applications", ApplicationRoutes);

//!Network & Notifications
router.use("/network", NetworkRoutes);

//!Admin
router.use("/admin", AdminRoutes);

//!Interviews
router.use("/interviews", InterviewRoutes);

//!Blogs
router.use("/blogs", BlogRoutes);

//!Reviews
router.use("/reviews", ReviewRoutes);

//!Newsletter
router.use("/newsletter", NewsletterRoutes);

//!Contact
router.use("/contact", ContactRoutes);

//!Payment
router.use("/payment", PaymentRouter);

//!AI Fraud Detection
router.use("/admin/fraud-shield", FraudDetectionRouter);

//!AI Market Intelligence
router.use("/admin/market-intelligence", MarketIntelligenceRouter);

//!AI Support Agent
router.use("/admin/support-agent", SupportAgentRouter);

// Public support agent routes
router.use("/support-agent", SupportAgentRouter);

//!AI Content Sanity
router.use("/admin/content-sanity", ContentSanityRouter);

//!AI Anomaly Detection
router.use("/admin/anomaly-detection", AnomalyDetectionRouter);

//!AI Churn Predictor
router.use("/admin/churn-predictor", ChurnPredictionRouter);

//!Platform Settings
router.use("/admin/settings", PlatformSettingsRouter);

//!AI Job Description Generator
router.use("/ai/job-description", JobDescriptionRouter);

//!AI Bio Generator
router.use("/ai/bio-generator", BioGeneratorRouter);

//!AI Blog Generator
router.use("/ai/blog-generator", BlogGeneratorRoutes);

import { SubscriptionRoutes } from "./subscription/subscription.route";

//!Subscription
router.use("/subscription", SubscriptionRoutes);

//!Payment
router.use("/payment", PaymentRouter);

export default router;
