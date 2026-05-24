-- AlterTable
ALTER TABLE "JobSeekerProfile" ADD COLUMN "expertise" TEXT[],
ADD COLUMN "interests" TEXT[],
ADD COLUMN "linkedinUrl" TEXT,
ADD COLUMN "location" TEXT,
ADD COLUMN "openToAdvising" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "openToNetworking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "websiteUrl" TEXT;
