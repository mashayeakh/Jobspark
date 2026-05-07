// import { app } from "@/app";
// import express, { Application, NextFunction, Request, Response } from 'express';
// import { envVars } from "../config/env";
// import httpStatus from "http-status";
// import z from "zod";
// import { statusCodes } from "better-auth";
// // import { TErrorResponse, TErrorSources } from "../interfaces/error.interfaces";
// // import { handleZodError } from "../errorHelpers/handleZodError";
// import { AppError } from "../errorHelpers/AppError";



// export const globalErrHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

//     //this enables only for development time
//     if (envVars.NODE_ENV === "development") {
//         console.log("**Error from global error handler - ", err);
//     }

//     let errorSource: TErrorSources[] = []

//     let stautsCode: number = httpStatus.INTERNAL_SERVER_ERROR;
//     let message: string = "Internal Server Error";
//     let stack: string | undefined = undefined

//     //zor err pattern
//     /* [
//         {
//           expected: 'string',
//           code: 'invalid_type',
//           path: [ 'username' ],
//           message: 'Invalid input: expected string'
//         },
//         {
//           expected: 'number',
//           code: 'invalid_type',
//           path: [ 'xp' ],
//           message: 'Invalid input: expected number'
//         }
//       ] */


//     if (err instanceof z.ZodError) {

//         const simplifiedErr = handleZodError(err);

//         stautsCode = simplifiedErr.stautsCode as number;
//         message = simplifiedErr.message;

//         errorSource = [...simplifiedErr.errorSource];
//     } else if (err instanceof AppError) {
//         stautsCode = err.statusCode,
//             message = err.message,
//             stack = err.stack,
//             errorSource = [{
//                 path: "",
//                 message: err.message
//             }]
//     }


//     else if (err instanceof Error) {
//         stautsCode = httpStatus.INTERNAL_SERVER_ERROR,
//             message = err.message,
//             stack = err.stack,
//             errorSource = [{
//                 path: "",
//                 message: err.message
//             }]
//     }

//     const errorResponse: TErrorResponse = {
//         success: false,
//         message: message,
//         errorSource,
//         stack: envVars.NODE_ENV === "development" ? stack : undefined,
//         error: envVars.NODE_ENV === "development" ? err : undefined,
//     }

//     res.status(stautsCode).json({ errorResponse })
// }
