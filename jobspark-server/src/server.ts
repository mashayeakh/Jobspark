import express, { Application, Request, Response } from "express";
import { app } from "./app";
import dotenv from 'dotenv'
// import { envVars } from "./app/config/env";
// import { seedAdmin } from "./app/scripts/seedAdmin/seedAdmin";

dotenv.config();

const port = process.env.PORT
// console.log("port = ", process.env.PORT)

const bootstrap = async () => {
    try {
        // seeding admin and optional demo user
        // await seedAdmin();
        // await seedDemoUser();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Failed to start server", error)
    }
}

// Run listen only in non-serverless environments
// if (process.env.VERCEL !== '1') {
//     bootstrap();
// } else {
//     // On Vercel: seed admin and optional demo user on cold start without listen()
//     Promise.all([seedAdmin(), seedDemoUser()]).catch(console.error);
// }

bootstrap();

// Required export for Vercel serverless
export default app;