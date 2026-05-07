import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
import { envVars } from "../config/env";

export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [
        envVars.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    emailVerification: {
        sendOnSignUp: false,
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === "production",
        cookies: {
            sessionToken: {
                name: "session_token",
                attributes: {
                    sameSite: "none",
                    secure: process.env.NODE_ENV === "production",
                    httpOnly: true,
                    partitioned: true,
                }
            },
            state: {
                name: "auth_state",
                attributes: {
                    sameSite: "none",
                    secure: process.env.NODE_ENV === "production",
                    httpOnly: true,
                    partitioned: true,
                }
            },
        }
    },
    session: {
        expiresIn: 60 * 60 * 24,       // fixed: was 60*60*60*24
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24,
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "JOB_SEEKER",
                required: false,
                fieldName: "role",
                input: true,
            },
            isDeleted: {
                type: "boolean",
                required: false,
                defaultValue: false,
                fieldName: "isDeleted",
                input: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
                fieldName: "status",
                input: false,
            },
            deletedAt: {
                type: "string",
                required: false,
                fieldName: "deletedAt",
                input: false,
            },
        },
    },
    plugins: [
        bearer(),
    ],
});
