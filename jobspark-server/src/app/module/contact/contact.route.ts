import express from 'express';
import { ContactController } from './contact.controller';

const router = express.Router();

router.post('/send', ContactController.sendMessage);

export const ContactRoutes = router;
