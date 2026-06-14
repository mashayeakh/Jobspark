import Redis from "ioredis";
import { envVars } from "../config/env";
import { Request, Response } from "express";
import status from "http-status";
import { RedisStore } from 'rate-limit-redis';

import { rateLimit, Options, ipKeyGenerator as erlIpKeyGenerator } from 'express-rate-limit';

//1 . shared redis client
const redisClient = new Redis(envVars.REDIS_URL, {
    //silently fail, if redis is unavailable - do not crash the server
    // lazyConnect: true,
    // enableOfflineQueue: false,
    //reject first request if redis is down

    tls: envVars.REDIS_URL.startsWith("rediss://") ? {} : undefined
});

redisClient.on("error", (err) => {
    console.error("[RateLimiter] Redis connection error:", err);
});

redisClient.on("connect", () => {
    console.log("✅ [RateLimiter] Redis connected successfully for rate limiting. ")
})

// 2. Standard Err Response
const rateLimitHandler = (req: Request, res: Response, next: any, options: Options) => {
    res.status(options.statusCode || status.TOO_MANY_REQUESTS).json({
        success: false,
        message: options.message || "Too many requests. Please slow down and try again later",
        details: {
            retryAfter: res.getHeader("Retry-After"),

        }
    });
};

//3. Factory Function
//custom limiter
export const createRateLimiter = (name: string, options: Partial<Options>) => {
    return rateLimit({
        // Always use Redis store — fails open if Redis is down
        store: new RedisStore({
            sendCommand: (...args: string[]) => (redisClient as any).call(...args),
            prefix: `rl:${name}:`
        }),
        standardHeaders: "draft-8",
        legacyHeaders: false,
        handler: rateLimitHandler,
        // If Redis is down, skip rate limiting instead of crashing (fail open)

        skip: async (req: Request) => {
            //skip on localhost and for admins
            if (redisClient.status !== "ready") {
                console.warn('[RateLimiter] Redis not ready — skipping rate limit for this request');
                return true;
            }
            return false;
        },
        ...options
    })
}

// 4. key generators
// ip based key (for unauthenticated routes like logiin, register)
const ipKeyGenerator = (req: Request): string => {
    return `ip:${erlIpKeyGenerator(req as any)}`;
};


//user-based key with IP fallback(for authenticated routes like AI)
const userKeyGenerator = (req: Request): string => {
    const userId = (req as any).user?.userId;
    return userId ? `user:${userId}` : ipKeyGenerator(req);
}

//5. pre-built named limiter

// Auth: Login - 10 attempts per 15 mins per ip
export const loginLimiter = createRateLimiter('login', {
    windowMs: 15 * 60 * 1000,
    limit: 10,
    keyGenerator: ipKeyGenerator,
    message: "Too many login attempts. Please try again in 15 minutes."
});

// Auth: Register - 5 accounts per hour per ip
export const registerLimiter = createRateLimiter('register', {
    windowMs: 60 * 60 * 1000,
    limit: 5,
    keyGenerator: ipKeyGenerator,
    message: "Too many registration attempts. Please try again in 1 hour."
});

// Contact Form — 5 submissions per hour per IP
export const contactLimiter = createRateLimiter('contact', {
    windowMs: 60 * 60 * 1000,
    limit: 5,
    keyGenerator: ipKeyGenerator,
    message: "Too many contact form submissions. Please try again in 1 hour.",

});

// newsletter - 3 subscriptions per hour per ip
export const newsletterLimiter = createRateLimiter('newsletter', {
    windowMs: 60 * 60 * 1000,
    limit: 3,
    keyGenerator: ipKeyGenerator,
    message: "Too many newsletter subscriptions. Please try again in 1 hour.",
});

//AI toures - 30 request per hour tracked per authenticated user (no Ip)

//this prevents shared office / uni ips from blocking each other. 
export const aiLimiter = createRateLimiter('ai', {
    windowMs: 60 * 60 * 1000,
    limit: 30,
    keyGenerator: userKeyGenerator,
    message: "Too many AI requests. Please try again in 1 hour.",
})

// Admin Routes — 100 requests per 15 minutes (generous, admins are trusted)
export const adminLimiter = createRateLimiter('admin', {
    windowMs: 15 * 60 * 1000,
    limit: 100,
    keyGenerator: userKeyGenerator,
    message: 'Admin request limit reached. Please try again shortly.',
});

// General API — safety net for all /api/v2/ routes (200 req / 15 min)
export const generalApiLimiter = createRateLimiter('general', {
    windowMs: 15 * 60 * 1000,
    limit: 200,
    keyGenerator: ipKeyGenerator,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
});