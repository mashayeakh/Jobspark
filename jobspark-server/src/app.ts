import express, { Application, NextFunction, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import router from './app/module';
import { notFound } from './app/middleware/notFound';
import { errorHandler } from './app/middleware/globalErrorHandler';
import { envVars } from './app/config/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app: Application = express()

// Middleware to parse JSON request bodies
app.use(express.json());
const allowedOrigins = new Set(
    [
        envVars.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000",
    ].filter(Boolean),
);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow tools like Postman/cURL and same-origin server calls.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.has(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(cookieParser());

const secretKey = process.env.SESSION_SECRET_KEY || "your-default-secret-key";





app.use("/api/v2/", router);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello JobPark!')
})

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
})

app.use(errorHandler);

// //not found
app.use(notFound);
