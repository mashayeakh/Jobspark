import express, { Application, NextFunction, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import router from './app/module';
import { notFound } from './app/middleware/notFound';
import { errorHandler } from './app/middleware/globalErrorHandler';
import { envVars } from './app/config/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { SubscriptionController } from './app/module/subscription/subscription.controller';
import { PaymentController } from './app/module/payment/payment.controller';
import { generalApiLimiter } from './app/middleware/rateLimiter';

export const app: Application = express()

app.set("trust proxy", 1); //needed for rate limiting to get real client ip

// Middleware to parse JSON request bodies - MUST be before webhook routes
const jsonMiddleware = express.json();

//for stripe payment webhooks (raw body needed for signature verification)
app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.webhook);
app.post("/payment/webhook", express.raw({ type: "application/json" }), PaymentController.webhook);

// Apply JSON middleware after webhook routes
app.use(jsonMiddleware);

const allowedOrigins = new Set(
    [
        envVars.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
        "https://jobspark-frontend.vercel.app",
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

            const cleanOrigin = origin.replace(/\/$/, "");
            const isAllowed = Array.from(allowedOrigins).some(allowed => {
                if (!allowed) return false;
                const cleanAllowed = allowed.replace(/\/$/, "");
                return cleanOrigin === cleanAllowed;
            });

            if (isAllowed || process.env.NODE_ENV !== "production") {
                return callback(null, true);
            }

            return callback(new Error(`Not allowed by CORS: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(cookieParser());

const secretKey = process.env.SESSION_SECRET_KEY || "your-default-secret-key";



app.use("/api/v2", generalApiLimiter);

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
