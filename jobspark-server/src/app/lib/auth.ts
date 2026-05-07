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
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    emailVerification: {
        sendOnSignUp: false,
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