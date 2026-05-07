import { ApplicationStatus } from "prisma/generated/client";

export interface ApplyJobDto {
  jobId: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  reason?: string;
}
