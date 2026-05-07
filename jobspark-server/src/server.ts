import { app } from "./app";
import dotenv from 'dotenv'
import { seedAdmin } from "./app/scripts/seedAdmin";

dotenv.config();

const port = process.env.PORT

const bootstrap = async () => {
    try {
        // Seed admin on every startup (idempotent - safe to run multiple times)
        await seedAdmin();
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

export default app;
