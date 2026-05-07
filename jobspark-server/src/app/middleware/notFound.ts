import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from "http-status";

export const notFound = (req: Request, res: Response) => {

    res.status(httpStatus.NOT_FOUND || 404).json({
        success: false,
        message: `Route ${req.originalUrl} not found!`,
        time: Date()
    })
}
