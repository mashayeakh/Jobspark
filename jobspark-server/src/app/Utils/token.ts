import { JwtPayload, SignOptions } from "jsonwebtoken";
import { createToken } from "./jwt";
import { envVars } from "../config/env";
import { refreshToken } from "better-auth/api";
import { Response } from "express";
import { setCookie } from "./cookies";
import ms, { StringValue } from "ms";

//* create access token
export const getAccessToken = (payload: JwtPayload) => {
    return createToken(
        payload,
        envVars.ACCESS_TOKEN_SECRET,
        {
            expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN
        } as SignOptions

    )
}

//* create refresh token
export const getRefreshToken = (payload: JwtPayload) => {
    return createToken(
        payload,
        envVars.REFRESH_TOKEN_SECRET,
        {
            expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN
        } as SignOptions

    )
}

//* set access token in cookie
export const setAccessTokenCookie = (res: Response, token: string) => {
    const maxAge = ms((envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue));
    setCookie(res, "accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 60 * 24 * 1000 //1d 
    })
}

//* set refresh token in cookie
export const setRefreshTokenCookie = (res: Response, token: string) => {
    // const maxAge = ms((envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue));
    setCookie(res, "refreshToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 60 * 24 * 1000 //1d 
    })
}


//* better auth session cookie
export const setBetterAuthSessionCookie = (res: Response, token: string) => {
    // const maxAge = ms((envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue))
    setCookie(res, "better-auth.session_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        // maxAge: Number(maxAge)
        maxAge: 60 * 60 * 60 * 24 * 1000 // 1d
    })
}