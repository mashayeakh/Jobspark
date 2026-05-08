"prisma/generated";

import { ExperienceLevel, JobStatus, JobType, LocationType } from "prisma/generated/prisma/enums";

export interface CreateJobDto {
  title: string;
  description: string;
  status?: JobStatus;
  type?: JobType;
  locationType?: LocationType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  categoryId?: string;
  subCategoryId?: string;
  skills: {
    name: string;
    isRequired?: boolean;
  }[];
}

export interface UpdateJobDto {
  title?: string;
  description?: string;
  status?: JobStatus;
  type?: JobType;
  locationType?: LocationType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
  categoryId?: string;
  subCategoryId?: string;
  skills?: {
    name: string;
    isRequired?: boolean;
  }[];
}

export interface JobFiltersDto {
  searchTerm?: string;
  type?: JobType;
  locationType?: LocationType;
  experienceLevel?: ExperienceLevel;
  minSalary?: number;
  maxSalary?: number;
  categoryId?: string;
  subCategoryId?: string;
}
