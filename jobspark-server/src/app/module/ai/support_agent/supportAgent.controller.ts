import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { SupportAgentService } from "./supportAgent.service";

export const SupportAgentController = {
  // Chat with support agent
  chat: catchAsyc(async (req: Request, res: Response) => {
    const { message, sessionId } = req.body;
    const userId = req.user?.userId;

    if (!message || !sessionId) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Message and sessionId are required",
        result: null,
      });
    }

    // Get or create session
    await SupportAgentService.getOrCreateSession(sessionId, userId);

    // Process message and get response
    const response = await SupportAgentService.processMessage(message, sessionId, userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Support agent response generated",
      result: response,
    });
  }),

  // Get session history
  getSessionHistory: catchAsyc(async (req: Request, res: Response) => {
    const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;

    const history = await SupportAgentService.getSessionHistory(sessionId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Session history retrieved",
      result: history,
    });
  }),

  // Get support statistics
  getStats: catchAsyc(async (req: Request, res: Response) => {
    const stats = await SupportAgentService.getStats();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Support statistics retrieved",
      result: stats,
    });
  }),

  // Get active sessions
  getActiveSessions: catchAsyc(async (req: Request, res: Response) => {
    const sessions = await SupportAgentService.getActiveSessions();

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Active sessions retrieved",
      result: sessions,
    });
  }),

  // Escalate to human support
  escalateToHuman: catchAsyc(async (req: Request, res: Response) => {
    const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
    const { reason } = req.body;
    const userId = req.user?.userId;

    if (!reason) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Reason for escalation is required",
        result: null,
      });
    }

    const ticket = await SupportAgentService.escalateToHuman(sessionId, reason, userId);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Escalated to human support",
      result: ticket,
    });
  }),

  // Add knowledge base article
  addKnowledgeArticle: catchAsyc(async (req: Request, res: Response) => {
    const { title, content, category, tags } = req.body;

    if (!title || !content || !category) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Title, content, and category are required",
        result: null,
      });
    }

    const article = await SupportAgentService.addKnowledgeArticle({
      title,
      content,
      category,
      tags: tags || [],
    });

    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Knowledge base article added",
      result: article,
    });
  }),

  // Search knowledge base
  searchKnowledgeBase: catchAsyc(async (req: Request, res: Response) => {
    const { query, category } = req.query;

    if (!query) {
      return sendResponse(res, {
        httpStatusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "Search query is required",
        result: null,
      });
    }

    const articles = await SupportAgentService.searchKnowledgeBase(
      query as string,
      category as string
    );

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Knowledge base search completed",
      result: articles,
    });
  }),
};
