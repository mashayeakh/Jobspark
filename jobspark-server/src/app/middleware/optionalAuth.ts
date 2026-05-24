import { NextFunction, Request, Response } from 'express';
import { prisma } from "../lib/prisma";
import { getCookie } from '../Utils/cookies';
import { vefiryToken } from '../Utils/jwt';
import { envVars } from "../config/env";
import { UserRole, UserStatus } from 'prisma/generated/prisma/enums';

export const extractOptionalAuth = () =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionToken = getCookie(req, "better-auth.session_token");
            const accessTokenCookie = getCookie(req, "accessToken");
            const authHeader = req.headers.authorization;
            const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
            const accessToken = accessTokenCookie || bearerToken;

            let isAuthenticated = false;

            if (sessionToken) {
                const sessionExists = await prisma.session.findFirst({
                    where: {
                        token: sessionToken,
                        expiresAt: { gt: new Date() }
                    },
                    include: { user: true }
                });

                if (sessionExists && sessionExists.user) {
                    const user = sessionExists.user;
                    if (user.status !== UserStatus.BLOCKED && user.status !== UserStatus.DELETED && !user.isDeleted) {
                        req.user = {
                            userId: user.id,
                            email: user.email,
                            role: user.role as UserRole,
                        };
                        isAuthenticated = true;
                    }
                }
            }

            if (!isAuthenticated && accessToken) {
                const verifiedtoken = vefiryToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
                if (verifiedtoken.success) {
                    req.user = {
                        ...verifiedtoken.data
                    } as any;
                    isAuthenticated = true;
                }
            }

            next();
        } catch (error: any) {
            next();
        }
    };
