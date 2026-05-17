import express from "express";
import { BlogController } from "./blog.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "@/app/lib/prisma";

const router = express.Router();

router.post("/", checkAuth(UserRole.ADMIN), BlogController.createBlog);
router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getSingleBlog);

export const BlogRoutes = router;
