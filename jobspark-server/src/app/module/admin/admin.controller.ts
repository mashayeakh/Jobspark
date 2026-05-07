import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import { UserStatus } from "prisma/generated";

export const AdminController = {
  // Analytics Dashboard
  getPlatformSnapshot: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.getPlatformSnapshot();
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Platform analytics fetched successfully",
      result,
    });
  }),

  getAnalyticsHistory: catchAsyc(async (req: Request, res: Response) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const result = await AdminService.getAnalyticsHistory(days);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Historical analytics fetched successfully",
      result,
    });
  }),

  getAnalyticsLogs: catchAsyc(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const result = await AdminService.getAnalyticsLogs(limit);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Analytics logs fetched successfully",
      result,
    });
  }),

  // User Management
  getAllUsers: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.getAllUsers(req.query as any);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Users fetched successfully",
      result,
    });
  }),

  blockUser: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.updateUserStatus(req.params.userId as string, UserStatus.BLOCKED);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "User blocked successfully",
      result,
    });
  }),

  unblockUser: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.updateUserStatus(req.params.userId as string, UserStatus.ACTIVE);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "User unblocked successfully",
      result,
    });
  }),

  deleteUser: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.deleteUser(req.params.userId as string);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "User deleted successfully",
      result,
    });
  }),

  // Company Management
  getAllCompanies: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.getAllCompanies();
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Companies fetched successfully",
      result,
    });
  }),

  verifyCompany: catchAsyc(async (req: Request, res: Response) => {
    const { companyId } = req.params;
    const { isVerified } = req.body;
    const result = await AdminService.verifyCompany(companyId as string, isVerified);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: `Company ${isVerified ? "verified" : "unverified"} successfully`,
      result,
    });
  }),

  // Job Moderation
  getAllJobs: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.getAllJobsForAdmin();
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "All jobs fetched successfully",
      result,
    });
  }),

  forceUpdateJobStatus: catchAsyc(async (req: Request, res: Response) => {
    const { jobId } = req.params;
    const { status: newStatus } = req.body;
    const result = await AdminService.forceUpdateJobStatus(jobId as string, newStatus);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Job status updated successfully",
      result,
    });
  }),

  // Skill Management
  getAllSkills: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.getAllSkills();
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Skills fetched successfully",
      result,
    });
  }),

  createSkill: catchAsyc(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await AdminService.createSkill(name);
    sendResponse(res, {
      httpStatusCode: httpStatus.CREATED,
      success: true,
      message: "Skill created successfully",
      result,
    });
  }),

  deleteSkill: catchAsyc(async (req: Request, res: Response) => {
    const result = await AdminService.deleteSkill(req.params.skillId as string);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Skill deleted successfully",
      result,
    });
  }),
};
