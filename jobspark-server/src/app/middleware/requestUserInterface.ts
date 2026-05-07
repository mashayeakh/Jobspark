import { UserRole } from "prisma/generated";

export interface IRequestUser {
    userId: string,
    email: string,
    role: UserRole
}
