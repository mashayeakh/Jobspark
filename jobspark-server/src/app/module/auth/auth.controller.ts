import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/Utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";
import { setAccessTokenCookie, setBetterAuthSessionCookie, setRefreshTokenCookie } from "@/app/Utils/token";
import { clearCookie } from "@/app/Utils/cookies";

export const AuthController = {

    createUser: catchAsyc(
        async (req: Request, res: Response) => {
            const data = await AuthService.registerUser(req.body)
            sendResponse(res, {
                httpStatusCode: status.CREATED,
                success: true,
                message: "User Registered successfully",
                result: { ...data }
            })
        }
    ),

    loginUser: catchAsyc(
        async (req: Request, res: Response) => {

            const result = await AuthService.loginUser(req.body)
            const {
                accessToken,
                refreshToken,
                token,
                ...rest
            } = result

            setAccessTokenCookie(res, accessToken);
            setRefreshTokenCookie(res, refreshToken);
            setBetterAuthSessionCookie(res, token);


            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "User logged in successfully",
                result: {
                    token,
                    accessToken,
                    refreshToken,
                    ...rest
                }
            })
        }
    ),
    getNewToken: catchAsyc(
        async (req: Request, res: Response) => {
            //get the refresh token from cookie 
            const refreshToken = req.cookies['refreshToken'];
            const betterAuthSessionToken = req.cookies['better-auth.session_token'];

            if (!refreshToken) {
                throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
            }
            const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

            const {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            } = result;

            setAccessTokenCookie(res, accessToken);
            setRefreshTokenCookie(res, newRefreshToken);
            setBetterAuthSessionCookie(res, sessionToken);

            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "New access token generated successfully",
                result: {
                    accessToken,
                    refreshToken: newRefreshToken,
                    sessionToken,
                }
            })
        }
    ),

    //!logout user
    logout: catchAsyc(
        async (req: Request, res: Response) => {
            const betterAuthSessiontoken = req.cookies["better-auth.session_token"];

            const result = await AuthService.logout(betterAuthSessiontoken);

            //clear the cookies - access token
            clearCookie(res, 'accessToken', {
                httpOnly: true,
                secure: false,
                sameSite: "none",
            });
            //clear the cookies - refresh token
            clearCookie(res, 'refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: "none",
            });
            //clear the cookies - better-auth-session token
            clearCookie(res, 'better-auth.session_token', {
                httpOnly: true,
                secure: false,
                sameSite: "none",
            });

            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "You logged out successfully",
                result
            })
        }
    ),

};



