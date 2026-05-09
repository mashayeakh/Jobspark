/*
  Warnings:

  - Added the required column `name` to the `JobSeekerProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `RecruiterProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobSeekerProfile" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RecruiterProfile" ADD COLUMN     "name" TEXT NOT NULL;
