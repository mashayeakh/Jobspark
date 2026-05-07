import { prisma } from "../../lib/prisma";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";
import { auth } from "../../lib/auth";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import { envVars } from "@/app/config/env";
import { JwtPayload } from "jsonwebtoken";
import { getAccessToken, getRefreshToken } from "@/app/Utils/token";
import { UserStatus } from "prisma/generated/prisma/enums";
import { vefiryToken } from "@/app/Utils/jwt";

export const AuthService = {
    // registration
    registerUser: async (payload: RegisterUserDto) => {
        const { email, password, name, role, image, companyName, industry } = payload;

        // 1. Use Better Auth API for registration
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password: password || "",
                name,
                image,
                role,
            },
        });

        if (!result || !result.user) {
            throw new AppError(httpStatus.BAD_REQUEST, "Registration failed.");
        }

        const newUser = result.user;

        // 2. Initialize Profile based on role
        if (role === "JOB_SEEKER") {
            await prisma.jobSeekerProfile.create({
                data: {
                    userId: newUser.id,
                },
            });
        } else if (role === "RECRUITER") {
            if (!companyName || !industry) {
                throw new AppError(httpStatus.BAD_REQUEST, "Company name and industry are required for recruiters.");
            }

            // Create company first
            const company = await prisma.company.create({
                data: {
                    name: companyName,
                    industry: industry,
                }
            });

            // Then create profile linked to the company
            await prisma.recruiterProfile.create({
                data: {
                    userId: newUser.id,
                    companyId: company.id,
                },
            });
        }

        return newUser;
    },

    // login
    loginUser: async (payload: LoginUserDto) => {
        const { email, password } = payload;

        const data = await auth.api.signInEmail({
            body: {
                email,
                password: password || "",
            },
        });

        if (!data || !data.user) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid email or password.");
        }

        if (data.user.status === UserStatus.BLOCKED) {
            // throw new Error("User is blocked");
            throw new AppError(httpStatus.FORBIDDEN, "User is blocked")
        }

        //get the access token - short time
        const accessToken = getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleated: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        //get the refresh token - long time
        const refreshToken = getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleated: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        return {
            ...data,
            accessToken,
            refreshToken
        }
    },


    //! get new access token using refresh token
    async getNewToken(refreshToken: string, sessionToken: string) {

        //verify the refresh token. 
        const verifiedRefreshToken = vefiryToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);

        console.log("---- verifiend  refresh token ", verifiedRefreshToken)

        if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token")
        }

        const data = verifiedRefreshToken.data as JwtPayload

        // generate new access token
        const newAccessToken = getAccessToken({
            userId: data.userId,
            role: data.role,
            name: data.name,
            email: data.email,
            status: data.status,
            isDeleted: data.isDeleted,
            emailVerified: data.emailVerified,
        });



        //get the refresh token - long time (because when refresh is expired, then how will refresh token crate another access token, so we need to generate new refresh token as well) 
        const newRefreshToken = getRefreshToken({
            userId: data.userId,
            role: data.role,
            name: data.name,
            email: data.email,
            status: data.status,
            isDeleted: data.isDeleted,
            emailVerified: data.emailVerified,
        });

        //we will also check the session token. if the session token is valid then we will incraese it by 1d. it means update with day 1. 
        const isSessionTokenExist = await prisma.session.findUnique({
            where: {
                token: sessionToken,
                expiresAt: {
                    gt: new Date()// it means only find the session which is not expired yet.
                },
            },
            include: {
                user: true,
            }
        });

        if (!isSessionTokenExist) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid session token");
        }

        //now update the token with new expire time
        const upddatedSession = await prisma.session.update({
            where: {
                token: sessionToken,
            },
            data: {
                token: sessionToken,
                expiresAt: new Date((Date.now() + 60 * 60 * 60 * 24 * 1000)),
                updatedAt: new Date(),
            }
        })
        const { token } = upddatedSession
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            sessionToken: token
        }
    },

    //!logout user
    async logout(sessionToken: string) {
        return await auth.api.signOut({
            headers: {
                AUTHORIZATION: `Bearer ${sessionToken}`
            }
        })
    },

}
