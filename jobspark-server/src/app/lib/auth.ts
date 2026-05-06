import { betterAuth } from "better-auth";
import { prisma } from "./prisma";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { envVars } from "../config/env";


export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    // trustedOrigins: [
    //     envVars.FRONTEND_URL,
    //     envVars.BETTER_AUTH_URL,
    // ],

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to false for now to make testing easier
    },

    emailVerification: {
        sendOnSignUp: false,
    },

    // advanced: {
    //     useSecureCookies: process.env.NODE_ENV === "production",
    //     cookies: {
    //         sessionToken: {
    //             name: "session_token",
    //             attributes: {
    //                 sameSite: "none",
    //                 secure: process.env.NODE_ENV === "production",
    //                 httpOnly: true,
    //                 partitioned: true,
    //             }
    //         },
    //         state: {
    //             name: "auth_state",
    //             attributes: {
    //                 sameSite: "none",
    //                 secure: process.env.NODE_ENV === "production",
    //                 httpOnly: true,
    //                 partitioned: true,
    //             }
    //         },
    //     }
    // },

    // session: {
    //     expiresIn: 60 * 60 * 24,       // fixed: was 60*60*60*24
    //     updateAge: 60 * 60 * 24,
    //     cookieCache: {
    //         enabled: true,
    //         maxAge: 60 * 60 * 24,
    //     }
    // },

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            }
        }
    },

    plugins: [
        bearer(),
    ],
});

