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
            //! checking for session token
            //1 - check if any user logged in or not with session
            const sessionToken = getCookie(req, "better-auth.session_token");
            if (!sessionToken) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Please login as a recruiter to post a job");
            }

            //if i have the session token then you must check wheather it exists in db or not

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

                })
                if (sessionExists && sessionExists.user) {
                    //get the user
                    const user = sessionExists.user;

                    const now = new Date();
                    const expiresAt = sessionExists.expiresAt
                    const createdAt = sessionExists.createdAt

                    const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                    const timeRemaining = expiresAt.getTime() - now.getTime();
                    const percentRemaining = (timeRemaining / sessionLifeTime) * 100;


                    if (percentRemaining < 20) {
                        //send alert in the header
                        res.setHeader("X-Session-Refresh", "true")
                        res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                        res.setHeader("X-time-Remaining", timeRemaining.toString());

                        console.log("Session expiring soon!!!")
                    }

                    if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! User is not active")
                    }

                    if (user.isDeleted) {
                        throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! User is deleted")
                    }

                    //role
                    if (authRoles.length > 0 && !authRoles.includes(user.role as UserRole)) {
                        throw new AppError(httpStatus.FORBIDDEN, "Forbideen access!! You do not have permission to access this resource");
                    }
                    req.user = {
                        userId: user.id,
                        email: user.email,
                        role: user.role as UserRole,
                    }
                    // return next()
                }
            }
            //! now working for jwt - checking for access token
            //get the access token using getCookie
            const accessToken = getCookie(req, "accessToken");
            console.log("----Access Token found ", accessToken)
            if (!accessToken) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! No access token provided");
            }
            //verify the token
            const verifiedtoken = vefiryToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

            console.log("Token to be verified = ", verifiedtoken)
            if (!verifiedtoken.success) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access! Invalid access token");
            }
            //stop if you are not admin
            if (authRoles.length > 0 && !authRoles.includes(verifiedtoken.data!.role as UserRole)) {
                throw new AppError(httpStatus.FORBIDDEN, "Forbidden access! You do not have permission to access this");

            }

            next();
        } catch (error: any) {
            next(error)
        }
    }


