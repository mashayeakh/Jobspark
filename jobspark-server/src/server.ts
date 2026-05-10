import { app } from "./app";
import dotenv from 'dotenv'
import { seedAdmin } from "./app/scripts/seedAdmin";

dotenv.config();

const port = process.env.PORT || 5000;

const bootstrap = async () => {
    try {
        console.log(`🚀 Starting server in ${process.env.NODE_ENV} mode...`);
        // Seed admin on every startup (idempotent - safe to run multiple times)
        await seedAdmin();
        app.listen(port, () => {
            
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("💥 Failed to start server:", error)
        process.exit(1);
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

export default app;
