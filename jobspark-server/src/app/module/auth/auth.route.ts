import express from "express";
import { AuthController } from "./auth.controller";
import { loginLimiter, registerLimiter } from "@/app/middleware/rateLimiter";

const router = express.Router();

router.post("/register", registerLimiter, AuthController.createUser);
router.post("/login", loginLimiter, AuthController.loginUser);
router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
