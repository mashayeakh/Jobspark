import { UserRole } from "../../../../prisma/generated/client";

export interface RegisterUserDto {
  name: string;
  email: string;
  password?: string; // Optional for OAuth, but required for manual registration
  role: UserRole;
  image?: string;
}

export interface LoginUserDto {
  email: string;
  password?: string;
}
