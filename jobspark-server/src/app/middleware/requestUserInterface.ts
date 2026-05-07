import { UserRole } from "prisma/generated/client";

export interface IRequestUser {
    userId: string,
    email: string,
    role: UserRole
}