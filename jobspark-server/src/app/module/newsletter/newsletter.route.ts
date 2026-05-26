import express from 'express';
import { NewsletterController } from './newsletter.controller';

const router = express.Router();

router.post('/subscribe', NewsletterController.subscribe);

export const NewsletterRoutes = router;
