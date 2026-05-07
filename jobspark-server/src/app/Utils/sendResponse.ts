import { NextFunction, Request, RequestHandler, Response } from "express";


interface IResponseData<T> {
    httpStatusCode: number,
    success: boolean,
    message: string,
    result?: T,
    meta?: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
    }
}


//!send Response
export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
    const {
        httpStatusCode,
        success,
        message,
        result,

    } = responseData;

    // Fallback to 200 if status is missing, to prevent crashes
    res.status(httpStatusCode || 200).json({
        success,
        message,
        result
    })
}
