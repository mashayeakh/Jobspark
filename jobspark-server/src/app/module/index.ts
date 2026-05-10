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


import { ContentSanityRouter } from "./ai/content_sanity/contentSanity.route";
import { SupportAgentRouter } from "./ai/support_agent/supportAgent.route";
import { FraudDetectionRouter } from "./ai/fraud_detection/fraudDetection.route";
import { MarketIntelligenceRouter } from "./ai/market_intelligence/marketIntelligence.route";
import { AnomalyDetectionRouter } from "./ai/anomaly_detection/anomalyDetection.route";

const router = express.Router();

//!Auth
router.use("/auth", AuthRoutes);

//!JobSeeker
router.use("/jobseeker", JobSeekerRoutes);

//!Recruiter
router.use("/recruiter", RecruiterRoutes);

//!Category
router.use("/categories", CategoryRoutes);

//!WorkStyle
router.use("/workstyles", WorkStyleRoutes);

//!Jobs
router.use("/jobs", JobRoutes);

//!Applications
router.use("/applications", ApplicationRoutes);

//!Network & Notifications
router.use("/network", NetworkRoutes);

//!Admin
router.use("/admin", AdminRoutes);

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

export default router;
