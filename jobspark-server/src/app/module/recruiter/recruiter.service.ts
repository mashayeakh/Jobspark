import { prisma } from "../../lib/prisma";
import { UpdateRecruiterProfileDto } from "./recruiter.dto";

export const RecruiterService = {
  updateProfile: async (userId: string, payload: UpdateRecruiterProfileDto) => {
    const { position, company } = payload;

    const profile = await prisma.recruiterProfile.update({
      where: { userId },
      data: {
        position,
        company: company ? {
          update: company
        } : undefined
      },
      include: {
        company: true
      }
    });
    return profile;
  },

  getProfile: async (userId: string) => {
    const profile = await prisma.recruiterProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        company: true,
        jobs: true,
      },
    });
    return profile;
  },
};
