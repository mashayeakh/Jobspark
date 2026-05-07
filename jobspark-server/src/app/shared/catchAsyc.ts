import { NextFunction, Request, Response, RequestHandler } from "express";

export const catchAsyc = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            console.log(error)
            next(error);
        }
    }
}
