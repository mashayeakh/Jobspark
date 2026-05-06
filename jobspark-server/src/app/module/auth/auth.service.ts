import { prisma } from "../../lib/prisma";
import { LoginUserDto, RegisterUserDto } from "./auth.dto";
import { auth } from "../../lib/auth";

export const AuthService = {
    // registration
    registerUser: async (payload: RegisterUserDto) => {
        const { email, password, name, role, image } = payload;

        // 1. Use Better Auth API for registration
        // This handles hashing and database insertion via the Prisma adapter
        const result = await auth.api.signUpEmail({
            body: {
                email,
                password: password || "",
                name,
                image,
                role,
            },
        });

        if (!result || !result.user) {
            throw new Error("Registration failed.");
        }

        const newUser = result.user;

        // 2. Initialize Profile based on role
        if (role === "JOB_SEEKER") {
            await prisma.jobSeekerProfile.create({
                data: {
                    userId: newUser.id,
                },
            });
        } else if (role === "RECRUITER") {
            // Note: RecruiterProfile requires companyId, usually handled in separate step
        }

        return newUser;
    },

    // login
    loginUser: async (payload: LoginUserDto) => {
        const { email, password } = payload;

        const result = await auth.api.signInEmail({
            body: {
                email,
                password: password || "",
            },
        });

        if (!result || !result.user) {
            throw new Error("Invalid email or password.");
        }

        return result;
    }
}