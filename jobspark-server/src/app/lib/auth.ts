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

    // emailAndPassword: {
    //     enabled: true,
    //     requireEmailVerification: true,
    // },

    // emailVerification: {
    //     sendOnSignUp: true,
    //     sendOnSignIn: true,
    //     autoSignInAfterVerification: true,
    // },

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

    // plugins: [
    //     bearer(),

    //     emailOTP({
    //         overrideDefaultEmailVerification: true,
    //         sendVerificationOnSignUp: true, // ✅ critical for v1.4+

    //         async sendVerificationOTP({ email, otp, type }) {
    //             console.log(`[OTP] ✅ sendVerificationOTP CALLED — email=${email}, type=${type}, time=${new Date().toISOString()}`);

    //             // ── EMAIL VERIFICATION ──────────────────────────────────────
    //             if (type === "email-verification") {
    //                 console.log(`[OTP] Handling email-verification for ${email}`);

    //                 let user = await prisma.user.findUnique({ where: { email } });
    //                 console.log(`[OTP] DB lookup result — found=${!!user}, verified=${user?.emailVerified}, role=${user?.role}`);

    //                 if (!user) {
    //                     console.warn(`[OTP] User not found on first attempt. Retrying in 500ms...`);
    //                     await new Promise(resolve => setTimeout(resolve, 500));
    //                     user = await prisma.user.findUnique({ where: { email } });
    //                     console.log(`[OTP] Retry DB lookup — found=${!!user}`);
    //                 }

    //                 if (!user) {
    //                     console.error(`[OTP] ❌ User ${email} still not found after retry. Aborting.`);
    //                     return;
    //                 }

    //                 if (user.role === UserRole.ADMIN) {
    //                     console.log(`[OTP] ⏭ Skipping — user is ADMIN`);
    //                     return;
    //                 }

    //                 // removed !user.emailVerified guard — was silently blocking resends
    //                 console.log(`[OTP] Attempting to send verification email to ${email}...`);
    //                 sendEmail({
    //                     to: email,
    //                     subject: "Your OTP for email verification",
    //                     templateName: "otp",
    //                     templateData: {
    //                         name: user.name,
    //                         otp: otp,
    //                     }
    //                 })
    //                     .then(() => console.log(`[OTP] ✅ Verification email sent to ${email}`))
    //                     .catch((error: any) => console.error(`[OTP] ❌ Failed to send verification email to ${email}`, {
    //                         message: error?.message ?? error,
    //                         stack: error?.stack ?? null,
    //                         code: error?.code ?? null,
    //                         response: error?.response ?? null,
    //                     }));

    //                 console.log(`[OTP] sendEmail fired (non-blocking) for ${email}`);
    //             }

    //             // ── FORGOT PASSWORD ─────────────────────────────────────────
    //             else if (type === "forget-password") {
    //                 console.log(`[OTP] Handling forget-password for ${email}`);

    //                 const user = await prisma.user.findUnique({ where: { email } });
    //                 console.log(`[OTP] DB lookup result — found=${!!user}`);

    //                 if (!user) {
    //                     console.error(`[OTP] ❌ User ${email} not found. Aborting.`);
    //                     return;
    //                 }

    //                 console.log(`[OTP] Attempting to send password reset email to ${email}...`);
    //                 sendEmail({
    //                     to: email,
    //                     subject: "Your OTP for password reset",
    //                     templateName: "otp",
    //                     templateData: {
    //                         name: user.name,
    //                         otp: otp,
    //                     }
    //                 })
    //                     .then(() => console.log(`[OTP] ✅ Password reset email sent to ${email}`))
    //                     .catch((error: any) => console.error(`[OTP] ❌ Failed to send password reset email to ${email}`, {
    //                         message: error?.message ?? error,
    //                         stack: error?.stack ?? null,
    //                         code: error?.code ?? null,
    //                         response: error?.response ?? null,
    //                     }));

    //                 console.log(`[OTP] sendEmail fired (non-blocking) for ${email}`);
    //             }

    //             // ── UNKNOWN TYPE ────────────────────────────────────────────
    //             else {
    //                 console.warn(`[OTP] ⚠️ Unhandled OTP type: ${type} for ${email}`);
    //             }

    //             console.log(`[OTP] sendVerificationOTP handler finished for ${email}`);
    //         },

    //         expiresIn: 2 * 60,
    //         otpLength: 6,
    //     })
    // ],
});

