import express from 'express';
import { BlogGeneratorController } from './blogGenerator.controller';
import { checkAuth } from '@/app/middleware/checkAuth';
import { UserRole } from '@/app/lib/prisma';
import { aiLimiter } from '@/app/middleware/rateLimiter';

const router = express.Router();

// Only admins should generate blogs
router.post(
  '/generate',
  checkAuth(UserRole.ADMIN),
  aiLimiter,
  BlogGeneratorController.generateBlog
);

export const BlogGeneratorRoutes = router;
