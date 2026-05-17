import express from 'express';
import pkg from '@prisma/client';
const { UserRole } = pkg;
import { InterviewController } from './interview.controller';
import { checkAuth } from '@/app/middleware/checkAuth';

const router = express.Router();

router.post(
  '/',
  checkAuth(UserRole.RECRUITER),
  InterviewController.createInterview
);

router.get(
  '/',
  checkAuth(UserRole.RECRUITER),
  InterviewController.getMyInterviews
);

router.patch(
  '/:id',
  checkAuth(UserRole.RECRUITER),
  InterviewController.updateInterview
);

router.post(
  '/:id/cancel',
  checkAuth(UserRole.RECRUITER),
  InterviewController.cancelInterview
);

export const InterviewRoutes = router;
