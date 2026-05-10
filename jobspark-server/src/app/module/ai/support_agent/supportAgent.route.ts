import express from "express";
import { SupportAgentController } from "./supportAgent.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// Public routes (no authentication required for basic support)
router.post("/chat", SupportAgentController.chat);
router.get("/history/:sessionId", SupportAgentController.getSessionHistory);

// Admin only routes
router.use(checkAuth(UserRole.ADMIN));

// Get support statistics
router.get("/stats", SupportAgentController.getStats);

// Get active sessions
router.get("/active-sessions", SupportAgentController.getActiveSessions);

// Escalate to human support
router.post("/escalate/:sessionId", SupportAgentController.escalateToHuman);

// Knowledge base management
router.post("/knowledge", SupportAgentController.addKnowledgeArticle);
router.get("/knowledge/search", SupportAgentController.searchKnowledgeBase);

export const SupportAgentRouter = router;
