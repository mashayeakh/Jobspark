import { UserRole } from "prisma/generated/prisma/enums";


export interface RegisterUserDto {
  name: string;
  email: string;
  password?: string; // Optional for OAuth, but required for manual registration
  role: UserRole;
  image?: string;
  companyName?: string; // Required if role is RECRUITER
  industry?: string;    // Required if role is RECRUITER
}

export interface LoginUserDto {
  email: string;
  password?: string;
}
