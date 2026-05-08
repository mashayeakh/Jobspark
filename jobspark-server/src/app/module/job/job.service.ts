import { Prisma } from "prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateJobDto, JobFiltersDto, UpdateJobDto } from "./job.dto";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";

export const JobService = {
  createJob: async (userId: string, payload: CreateJobDto) => {
    const { skills, ...jobData } = payload;

    // 1. Get recruiter profile to get companyId
    const recruiter = await prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiter) {
      throw new AppError(httpStatus.FORBIDDEN, "Only recruiters can post jobs.");
    }

    return await prisma.$transaction(async (tx) => {
      // 2. Create the Job
      const job = await tx.job.create({
        data: {
          ...jobData,
          recruiterId: recruiter.id,
          companyId: recruiter.companyId,
        },
      });

      // 3. Handle Skills
      if (skills && skills.length > 0) {
        // Bulk create missing skills
        await tx.skill.createMany({
          data: skills.map((s) => ({ name: s.name })),
          skipDuplicates: true,
        });

        // Get IDs
        const skillRecords = await tx.skill.findMany({
          where: { name: { in: skills.map((s) => s.name) } },
        });

        // Create JobSkills
        await tx.jobSkill.createMany({
          data: skills.map((s) => ({
            jobId: job.id,
            skillId: skillRecords.find((sr) => sr.name === s.name)!.id,
            isRequired: s.isRequired !== undefined ? s.isRequired : true,
          })),
        });
      }

      return await tx.job.findUnique({
        where: { id: job.id },
        include: {
          skills: { include: { skill: true } },
          company: true,
          category: true,
          subCategory: true,
        },
      });
    });
  },

  getAllJobs: async (filters: JobFiltersDto) => {
    const { searchTerm, type, locationType, experienceLevel, minSalary, maxSalary, categoryId, subCategoryId } = filters;

    const where: Prisma.JobWhereInput = {
      status: "ACTIVE", // Only show active jobs to seekers
      deletedAt: null,
    };

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (type) where.type = type;
    if (locationType) where.locationType = locationType;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (minSalary) where.salaryMin = { gte: Number(minSalary) };
    if (maxSalary) where.salaryMax = { lte: Number(maxSalary) };
    if (categoryId) where.categoryId = categoryId;
    if (subCategoryId) where.subCategoryId = subCategoryId;

    return await prisma.job.findMany({
      where,
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
        category: true,
        subCategory: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  getJobById: async (id: string) => {
    // Check if job exists first
    const exists = await prisma.job.findUnique({
      where: { id, deletedAt: null },
      select: { id: true },
    });

    if (!exists) {
      throw new AppError(httpStatus.NOT_FOUND, "Job not found.");
    }

    // Increment viewCount and return full job data atomically
    const job = await prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        company: true,
        recruiter: {
          include: {
            user: {
              select: { name: true, email: true, image: true },
            },
          },
        },
        skills: {
          include: { skill: true },
        },
        category: true,
        subCategory: true,
      },
    });

    return job;
  },

  updateJob: async (userId: string, jobId: string, payload: UpdateJobDto) => {
    const { skills, ...jobData } = payload;

    // Check if job exists and belongs to this recruiter
    const existingJob = await prisma.job.findFirst({
      where: {
        id: jobId,
        recruiter: { userId },
      },
    });

    if (!existingJob) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to update this job.");
    }

    return await prisma.$transaction(async (tx) => {
      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: jobData,
      });

      if (skills) {
        await tx.jobSkill.deleteMany({ where: { jobId } });

        await tx.skill.createMany({
          data: skills.map((s) => ({ name: s.name })),
          skipDuplicates: true,
        });

        const skillRecords = await tx.skill.findMany({
          where: { name: { in: skills.map((s) => s.name) } },
        });

        await tx.jobSkill.createMany({
          data: skills.map((s) => ({
            jobId: updatedJob.id,
            skillId: skillRecords.find((sr) => sr.name === s.name)!.id,
            isRequired: s.isRequired !== undefined ? s.isRequired : true,
          })),
        });
      }

      return await tx.job.findUnique({
        where: { id: jobId },
        include: {
          skills: { include: { skill: true } },
          company: true,
          category: true,
          subCategory: true,
        },
      });
    });
  },

  getRecruiterJobs: async (userId: string) => {
    return await prisma.job.findMany({
      where: {
        recruiter: { userId },
        deletedAt: null,
      },
      include: {
        company: true,
        skills: {
          include: { skill: true },
        },
        category: true,
        subCategory: true,
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
