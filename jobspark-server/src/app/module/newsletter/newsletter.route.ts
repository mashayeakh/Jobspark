import express from 'express';
import { NewsletterController } from './newsletter.controller';
import { newsletterLimiter } from '@/app/middleware/rateLimiter';

const router = express.Router();

router.post('/subscribe', newsletterLimiter, NewsletterController.subscribe);

export const NewsletterRoutes = router;
