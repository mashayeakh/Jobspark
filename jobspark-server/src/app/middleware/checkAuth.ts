import express, { NextFunction, Request, Response } from 'express';
import { AppError } from "../errorHelpers/AppError";
import httpStatus from "http-status";
import { envVars } from "../config/env";
import { prisma } from "../lib/prisma";
import { getCookie } from '../Utils/cookies';
import { vefiryToken } from '../Utils/jwt';
import { UserRole, UserStatus } from 'prisma/generated/prisma/enums';

export const checkAuth = (...authRoles: UserRole[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionToken = getCookie(req, "better-auth.session_token");
            const accessTokenCookie = getCookie(req, "accessToken");
            const authHeader = req.headers.authorization;
            const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
            const accessToken = accessTokenCookie || bearerToken;

            if (!sessionToken && !accessToken) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! Please login to continue.");
            }

            let isAuthenticated = false;

            // 1. Try to authenticate with session token
            if (sessionToken) {
                const sessionExists = await prisma.session.findFirst({
                    where: {
                        token: sessionToken,
                        expiresAt: {
                            gt: new Date()
                        }
                    },
                    include: {
                        user: true
                    }
                });

                if (sessionExists && sessionExists.user) {
                    const user = sessionExists.user;

                    const now = new Date();
                    const expiresAt = sessionExists.expiresAt;
                    const createdAt = sessionExists.createdAt;

                    const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                    const timeRemaining = expiresAt.getTime() - now.getTime();
                    const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

                    if (percentRemaining < 20) {
                        res.setHeader("X-Session-Refresh", "true");
                        res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                        res.setHeader("X-time-Remaining", timeRemaining.toString());
                        console.log("Session expiring soon!!!");
                    }

                    if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! User is not active");
                    }

                    if (user.isDeleted) {
                        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! User is deleted");
                    }

                    if (authRoles.length > 0 && !authRoles.includes(user.role as UserRole)) {
                        throw new AppError(httpStatus.FORBIDDEN, "Forbidden access! You do not have permission to access this resource");
                    }

                    req.user = {
                        userId: user.id,
                        email: user.email,
                        role: user.role as UserRole,
                    };
                    isAuthenticated = true;
                }
            }

            // 2. Fallback to access token if session token is missing or invalid
            if (!isAuthenticated && accessToken) {
                console.log("----Access Token found ", accessToken);
                const verifiedtoken = vefiryToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
                console.log("Token to be verified = ", verifiedtoken);

                if (!verifiedtoken.success) {
                    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! Invalid access token");
                }

                if (authRoles.length > 0 && !authRoles.includes(verifiedtoken.data!.role as UserRole)) {
                    throw new AppError(httpStatus.FORBIDDEN, "Forbidden access! You do not have permission to access this resource");
                }

                req.user = {
                    ...verifiedtoken.data
                } as any;
                isAuthenticated = true;
            }

            if (!isAuthenticated) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! Invalid session or token");
            }

            next();
        } catch (error: any) {
            next(error);
        }
    }


