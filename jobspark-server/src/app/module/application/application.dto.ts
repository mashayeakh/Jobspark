import { ApplicationStatus } from "prisma/generated/prisma/enums";

export interface ApplyJobDto {
  jobId: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  reason?: string;
}
