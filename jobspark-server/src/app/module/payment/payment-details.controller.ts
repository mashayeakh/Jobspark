import { Request, Response } from "express";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { prisma } from "@/app/lib/prisma";

export const PaymentDetailsController = {
    getSubscriptionDetails: catchAsyc(async (req: Request, res: Response) => {
        const userId = (req as any).user?.userId;
        if (!userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
        }

        const recruiter = await prisma.recruiterProfile.findUnique({
            where: { userId },
            include: {
                subscriptions: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                }
            }
        });

        if (!recruiter) {
            throw new AppError(httpStatus.NOT_FOUND, "Recruiter profile not found");
        }

        const isSubscribed = ["ACTIVE", "TRIALING"].includes(recruiter.subscriptionStatus || "");
        const jobsCount = await prisma.job.count({
            where: { recruiterId: recruiter.id },
        });

        res.status(200).json({
            success: true,
            data: {
                isSubscribed,
                subscriptionStatus: recruiter.subscriptionStatus || "NONE",
                subscriptionStartedAt: recruiter.subscriptionStartedAt,
                currentPeriodEnd: recruiter.currentPeriodEnd,
                stripeCustomerId: recruiter.stripeCustomerId,
                jobsUsed: jobsCount,
                jobLimit: isSubscribed ? "UNLIMITED" : 2,
                subscriptions: recruiter.subscriptions || [],
            }
        });
    }),
};
