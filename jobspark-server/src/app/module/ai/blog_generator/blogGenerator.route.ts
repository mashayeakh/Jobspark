import express from 'express';
import { BlogGeneratorController } from './blogGenerator.controller';
import { checkAuth } from '@/app/middleware/checkAuth';
import { UserRole } from '@prisma/client';

const router = express.Router();

// Only admins should generate blogs
router.post(
  '/generate',
  checkAuth(UserRole.ADMIN),
  BlogGeneratorController.generateBlog
);

export const BlogGeneratorRoutes = router;
