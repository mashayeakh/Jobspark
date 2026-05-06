import express from "express";
import { AuthRoutes } from "./auth/auth.route";

const router = express.Router();

//!Auth
router.use(
    "/auth",
    AuthRoutes
);

export default router;