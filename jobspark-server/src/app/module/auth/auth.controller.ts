import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.registerUser(req.body);

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "User registered successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to register user",
            error: error
        });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await AuthService.loginUser(req.body);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User logged in successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials",
        });
    }
};

export const AuthController = {
    registerUser,
    loginUser,
};
