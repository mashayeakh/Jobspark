import express from 'express';
import { ContactController } from './contact.controller';
import { contactLimiter } from '@/app/middleware/rateLimiter';

const router = express.Router();

router.post('/send', contactLimiter, ContactController.sendMessage);

export const ContactRoutes = router;
