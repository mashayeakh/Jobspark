import express from 'express';
import { CommunicationController } from './communication.controller';
import { checkAuth } from '@/app/middleware/checkAuth';

const router = express.Router();

// Conversations & Messages
router.get('/conversations', checkAuth(), CommunicationController.getConversations);
router.get('/conversations/:applicationId', checkAuth(), CommunicationController.getConversationByApplicationId);
router.get('/conversations/:conversationId/messages', checkAuth(), CommunicationController.getMessages);
router.post('/conversations/:conversationId/messages', checkAuth(), CommunicationController.sendMessage);
router.patch('/messages/:messageId/read', checkAuth(), CommunicationController.markMessageAsRead);

// Emails
router.get('/emails/:applicationId', checkAuth(), CommunicationController.getEmailThreads);
router.post('/emails/:applicationId', checkAuth(), CommunicationController.sendEmail);

export const CommunicationRoutes = router;
