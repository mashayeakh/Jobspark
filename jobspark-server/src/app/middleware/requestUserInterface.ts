import { UserRole } from "prisma/generated/prisma/enums";

export interface IRequestUser {
    userId: string,
    email: string,
    role: UserRole
}
