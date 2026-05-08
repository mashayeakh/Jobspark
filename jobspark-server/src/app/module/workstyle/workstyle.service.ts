import { prisma } from "@/app/lib/prisma";
import { JobType, ExperienceLevel, LocationType } from "prisma/generated/prisma/enums";
import { CreateWorkStyleDto } from "./workstyle.dto";

const getAllWorkStyles = async () => {
  const result = await prisma.workStyle.findMany();
  return result;
};

const createWorkStyle = async (payload: CreateWorkStyleDto) => {
  const result = await prisma.workStyle.create({
    data: payload,
  });
  return result;
};

const getJobTypes = async () => {
  // Convert enum to { label, value } format
  const jobTypes = Object.values(JobType).map((type) => ({
    label: type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
    value: type,
  }));
  return jobTypes;
};

const getExperienceLevels = async () => {
  // Convert enum to { label, value } format
  const experienceLevels = Object.values(ExperienceLevel).map((level) => ({
    label: level.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
    value: level,
  }));
  return experienceLevels;
};

const getLocationTypes = async () => {
  // Convert enum to { label, value } format
  const locationTypes = Object.values(LocationType).map((type) => ({
    label: type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
    value: type,
  }));
  return locationTypes;
};

export const WorkStyleService = {
  getAllWorkStyles,
  createWorkStyle,
  getJobTypes,
  getExperienceLevels,
  getLocationTypes,
};
