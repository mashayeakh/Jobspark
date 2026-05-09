import dotenv from 'dotenv'


dotenv.config();

//create an interface to config all the thigngs in env
interface EnvConfig {
    NODE_ENV: string,
    PORT: string,
    DATABASE_URL: string
    BETTER_AUTH_SECRET: string,
    BETTER_AUTH_URL: string,
    // BETTER_AUTH_COOKIE_DOMAIN: string,
    ADMIN_EMAIL: string,
    ADMIN_PASSWORD: string,
    // // SEED_DEMO_USER: boolean,
    // // DEMO_USER_EMAIL: string,
    // // DEMO_USER_PASSWORD: string,
    ACCESS_TOKEN_SECRET: string,
    REFRESH_TOKEN_SECRET: string,
    ACCESS_TOKEN_EXPIRES_IN: string,
    REFRESH_TOKEN_EXPIRES_IN: string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string,
    FRONTEND_URL: string,
    // EMAIL_SENDER: {
    //     SMTP_USER: string,
    //     SMTP_PASS: string,
    //     SMTP_HOST: string,
    //     SMTP_PORT: string,
    //     SMTP_FROM: string,
    // },

    GEMINI_API_KEY: string,
    REDIS_URL: string,

    // STRIPE: {
    //     STRIPE_SECRET_KEY: string,
    //     STRIPE_WEBHOOK_SECRET: string,
    // }

    // CLOUDINARY: {
    //     CLOUD_NAME: string,
    //     API_KEY: string,
    //     API_SECRET: string,
    // },



    // BREVO_API_KEY: string,
    // BREVO_FROM_EMAIL: string,
    // BREVO_FROM_NAME: string,
}

//load env
const loadEnvVariables = (): EnvConfig => {

    const requiredVariables = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "FRONTEND_URL",
        // "BETTER_AUTH_COOKIE_DOMAIN",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
        // "EMAIL_SENDER_SMTP_USER",
        // "EMAIL_SENDER_SMTP_PASS",
        // "EMAIL_SENDER_SMTP_HOST",
        // "EMAIL_SENDER_SMTP_PORT",
        // "EMAIL_SENDER_SMTP_FROM",
        // "STRIPE_SECRET_KEY",
        // "STRIPE_WEBHOOK_SECRET",
        // "CLOUDINARY_CLOUD_NAME",
        // "CLOUDINARY_API_KEY",
        // "CLOUDINARY_API_SECRET",
        "GEMINI_API_KEY",
        "REDIS_URL",
        // "BREVO_API_KEY",
        // "BREVO_FROM_EMAIL",
        // "BREVO_FROM_NAME",
    ]

    // check for validation, if something is missing, throw new err
    requiredVariables.forEach((eachVari) => {
        if (!(process.env[eachVari])) {
            throw new Error(`Environment variable ${eachVari} is required but not set in .env file`)

            // throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Environment variable ${eachVari} is required but set in .env fil`)
        }
    })

    const nodeEnv = process.env.NODE_ENV as string;
    // const betterAuthUrl = (process.env.BETTER_AUTH_URL as string).replace(/\/$/, "");
    // const rawFrontendUrl =
    //     process.env.FRONTEND_URL ||
    //     process.env.APP_URL ||
    //     process.env.NEXT_PUBLIC_APP_URL ||
    //     "";
    // const frontendUrl = rawFrontendUrl.replace(/\/$/, "");

    // if (!frontendUrl) {
    //     throw new Error("Environment variable FRONTEND_URL or APP_URL or NEXT_PUBLIC_APP_URL is required but not set");
    // }

    // if (nodeEnv === "production") {
    //     if (/localhost|127\.0\.0\.1/i.test(betterAuthUrl)) {
    //         throw new Error("BETTER_AUTH_URL must be a production URL when NODE_ENV=production");
    //     }

    //     if (/localhost|127\.0\.0\.1/i.test(frontendUrl)) {
    //         throw new Error("FRONTEND_URL must be a production URL when NODE_ENV=production");
    //     }
    // }

    // const seed
    // User = process.env.SEED_DEMO_USER?.toLowerCase() === "true";

    // if (seedDemoUser) {
    //     if (!process.env.DEMO_USER_EMAIL) {
    //         throw new Error("Environment variable DEMO_USER_EMAIL is required when SEED_DEMO_USER=true");
    //     }
    //     if (!process.env.DEMO_USER_PASSWORD) {
    //         throw new Error("Environment variable DEMO_USER_PASSWORD is required when SEED_DEMO_USER=true");
    //     }
    // }

    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        // BETTER_AUTH_COOKIE_DOMAIN: process.env.BETTER_AUTH_COOKIE_DOMAIN as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        // SEED_DEMO_USER: seedDemoUser,
        // DEMO_USER_EMAIL: process.env.DEMO_USER_EMAIL ?? "",
        // DEMO_USER_PASSWORD: process.env.DEMO_USER_PASSWORD ?? "",
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
        REDIS_URL: process.env.REDIS_URL as string,
        // EMAIL_SENDER: {
        //     SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
        //     SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
        //     SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
        //     SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
        //     SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
        // },
        // STRIPE: {
        //     STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
        //     STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
        // },

        // CLOUDINARY: {
        //     CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
        //     API_KEY: process.env.CLOUDINARY_API_KEY as string,
        //     API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        // },



        // BREVO_API_KEY: process.env.BREVO_API_KEY as string,
        // BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL as string,
        // BREVO_FROM_NAME: process.env.BREVO_FROM_NAME as string,

    }
}

export const envVars = loadEnvVariables();
