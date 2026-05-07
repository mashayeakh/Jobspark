import express, { Application, NextFunction, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';

import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app: Application = express()

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(cookieParser());

const secretKey = process.env.SESSION_SECRET_KEY;  // Load from .env file

// app.use(session({
//     secret: secretKey, // A secret key for encryption
//     resave: false,             // Forces the session to be saved even if it wasn't modified
//     saveUninitialized: false,   // Save uninitialized session
//     cookie: {
//         // Make sure cookie is set correctly for localhost
//         secure: false,    // secure: true only for https
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24,
//     }  // Set to true if using HTTPS
// }));

import router from './app/module';
import { notFound } from './app/middleware/notFound';
import { errorHandler } from './app/middleware/globalErrorHandler';

app.use("/api/v2/", router);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello JobPark!')
})

// app.get('/api/test-db', async (req: Request, res: Response) => {
//     try {
//         const testUser = await prisma.user.create({
//             data: {
//                 name: "Test Recruiter",
//                 email: `recruiter-${Date.now()}@test.com`,
//                 role: "RECRUITER",
//                 recruiterProfile: {
//                     create: {
//                         position: "HR Manager",
//                         company: {
//                             create: {
//                                 name: "Test Corp",
//                                 industry: "Technology",
//                                 location: "Remote"
//                             }
//                         }
//                     }
//                 }
//             },
//             include: {
//                 recruiterProfile: {
//                     include: {
//                         company: true
//                     }
//                 }
//             }
//         });

//         res.json({
//             success: true,
//             message: "Database connection verified. Data pushed to Neon DB.",
//             data: testUser
//         });
//     } catch (error: any) {
//         console.error("Test DB Error:", error);
//         res.status(500).json({
//             success: false,
//             message: "Failed to push data to database.",
//             error: error.message
//         });
//     }
// });









// // Cron job for job expiration check every hour
// cron.schedule("0 * * * *", () => {
//     console.log("⏰ Running job expiration check...");
//     expireOldJobs();
// });

// // Function to expire old jobs (you must define this function somewhere)
// const expireOldJobs = () => {
//     console.log("Expiring old jobs...");

// };

//global error handler
app.use(errorHandler);

// //not found
app.use(notFound);