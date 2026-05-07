import { CookieOptions, NextFunction, Request, RequestHandler, Response } from "express";

//set the cookies
//- it takes res, key, value
export const setCookie = (res: Response, key: string, value: string, options: CookieOptions) => {
    res.cookie(key, value, options);
}

//get the cookie
export const getCookie = (req: Request, key: string) => {
    return req.cookies?.[key];
}

//clear the cookie
export const clearCookie = (res: Response, key: string, options: CookieOptions) => {
    res.clearCookie(key, options)
}