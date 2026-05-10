import express from "express";
import { MarketIntelligenceController } from "./marketIntelligence.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// Admin only routes
router.use(checkAuth(UserRole.ADMIN));

// Get industry hiring trends
router.get("/trends", MarketIntelligenceController.getIndustryTrends);

// Get market surge analysis
router.get("/surge", MarketIntelligenceController.getMarketSurge);

// Get demand forecasting
router.get("/forecast", MarketIntelligenceController.getDemandForecast);

// Get competitive intelligence
router.get("/competitive", MarketIntelligenceController.getCompetitiveIntelligence);

// Get comprehensive dashboard
router.get("/dashboard", MarketIntelligenceController.getDashboard);

export const MarketIntelligenceRouter = router;
