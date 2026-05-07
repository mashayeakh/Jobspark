import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "prisma/generated";
import { AppError } from "../errorHelpers/AppError";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

    if (res.headersSent) {
        return next(err);
    }

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message: string = "Internal Server Error";
    let details: any = null;

    //custom AppError
    if (err instanceof AppError
    ) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.message;
    }

    // Prisma Validation Error (invalid query, missing fields, wrong types)
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Prisma Validation Error";
        details = err.message;
    }

    // Prisma Known Errors (MOST IMPORTANT)
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {

        switch (err.code) {

            // case "P2002": // Unique constraint failed
            //     statusCode = httpStatus.CONFLICT;
            //     message = "Duplicate field value";
            //     // details = err.meta;
            //     const fields = (err.meta as any)?.target || [];
            //     details = {
            //         field: fields[0] || "unknown",
            //         message: `${fields[0]} already exists`
            //     };
            //     break;

            case "P2002":
                statusCode = httpStatus.CONFLICT;
                message = "Duplicate field value";

                const targetFields =
                    (err.meta as any)?.target ||
                    (err?.meta as any)?.cause?.constraint?.fields ||
                    (err?.meta as any)?.driverAdapterError?.cause?.constraint?.fields ||
                    [];

                const field = targetFields[0] || "unknown";

                details = {
                    field,
                    message: `${field} already exists`
                };
                break;

            case "P2003":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Invalid reference";

                const fkField =
                    err?.meta?.field_name ||
                    (err?.meta?.driverAdapterError as any)?.cause?.constraint?.fields?.[0] ||
                    (err?.meta?.driverAdapterError as any)?.message ||
                    "unknown";

                details = {
                    field: fkField,
                    message: `${fkField} is invalid or does not exist`
                };
                break;
            case "P2025":
                statusCode = httpStatus.NOT_FOUND;
                message = "Record not found";
                details = {
                    message: "The requested resource does not exist"
                };
                break;

            case "P2014":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Invalid relation data";
                details = {
                    message: "Relation constraint violation"
                };
                break;

            case "P2000":
                statusCode = httpStatus.BAD_REQUEST;
                message = "Input too long";

                const column = err?.meta?.column_name || "field";

                details = {
                    field: column,
                    message: `${column} exceeds allowed length`
                };
                break;

            case "P2001":
                statusCode = httpStatus.NOT_FOUND;
                message = "Record does not exist";
                details = {
                    message: "No record found for the given query"
                };
                break;

            default:
                statusCode = httpStatus.BAD_REQUEST;
                message = "Database error";
                details = {
                    message: err.message
                };
        }
    }

    // Prisma Unknown Errors
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Unknown database error";
        details = {
            message: err.message
        };
    }

    // Zod (future-proof, even if not using now)
    else if (err.name === "ZodError") {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation Error";
        details = err.errors?.map((e: any) => ({
            field: e.path.join("."),
            message: e.message
        }));
    }

    // Fallback (any unexpected error)
    else {
        statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        message = err.message || "Something went wrong";
        details = {
            message: err.stack || null
        };
    }

    // Log for debugging
    console.error(" ERROR:", err);

    res.status(statusCode || 500).json({
        success: false,
        message,
        details
    });
}
