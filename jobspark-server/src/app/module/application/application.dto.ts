import { ApplicationStatus } from "prisma/generated";

export interface ApplyJobDto {
  jobId: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  reason?: string;
}
