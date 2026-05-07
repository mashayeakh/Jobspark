import { prisma } from "../../lib/prisma";
import { UpdateJobSeekerProfileDto } from "./jobSeeker.dto";

export const JobSeekerService = {
  updateProfile: async (userId: string, payload: UpdateJobSeekerProfileDto) => {
    const { workExperience, education, skills, ...directFields } = payload;

    return await prisma.$transaction(async (tx) => {
      // 1. Update direct fields
      const profile = await tx.jobSeekerProfile.update({
        where: { userId },
        data: directFields,
      });

      // 2. Update Work Experience (if provided)
      if (workExperience) {
        await tx.workExperience.deleteMany({ where: { profileId: profile.id } });
        await tx.workExperience.createMany({
          data: workExperience.map((exp) => ({
            ...exp,
            profileId: profile.id,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
          })),
        });
      }

      // 3. Update Education (if provided)
      if (education) {
        await tx.education.deleteMany({ where: { profileId: profile.id } });
        await tx.education.createMany({
          data: education.map((edu) => ({
            ...edu,
            profileId: profile.id,
            startDate: new Date(edu.startDate),
            endDate: edu.endDate ? new Date(edu.endDate) : null,
          })),
        });
      }

      // 4. Update Skills (if provided)
      if (skills) {
        await tx.candidateSkill.deleteMany({ where: { profileId: profile.id } });
        
        // Bulk create missing skills
        await tx.skill.createMany({
          data: skills.map((s) => ({ name: s.name })),
          skipDuplicates: true,
        });

        // Get IDs for the skills
        const skillRecords = await tx.skill.findMany({
          where: { name: { in: skills.map((s) => s.name) } },
        });

        // Bulk create CandidateSkills
        await tx.candidateSkill.createMany({
          data: skills.map((s) => {
            const skillRecord = skillRecords.find((sr) => sr.name === s.name);
            return {
              profileId: profile.id,
              skillId: skillRecord!.id,
              level: s.level || 1,
              yearsExp: s.yearsExp || 0,
            };
          }),
        });
      }

      return await tx.jobSeekerProfile.findUnique({
        where: { id: profile.id },
        include: {
          workExperience: true,
          education: true,
          skills: {
            include: { skill: true },
          },
        },
      });
    }, {
      timeout: 10000, // 10 seconds timeout
    });
  },

  getProfile: async (userId: string) => {
    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        workExperience: true,
        education: true,
        skills: true,
      },
    });
    return profile;
  },
};
