import { cloudinary } from "@/app/Utils/cloudinary";
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

      // Update User name if provided
      if (directFields.name) {
        await tx.user.update({
          where: { id: userId },
          data: { name: directFields.name },
        });
      }

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

      const updated = await tx.jobSeekerProfile.findUnique({
        where: { id: profile.id },
        include: {
          workExperience: true,
          education: true,
          skills: {
            include: { skill: true },
          },
        },
      });

      return updated;
    }, {
      timeout: 10000,
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
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    // ✅ No signing needed — URL is public
    return profile;
  },

  getDashboardData: async (userId: string) => {
    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
      include: {
        skills: true,
        workExperience: true,
        education: true,
        applications: {
          take: 5,
          orderBy: { appliedAt: 'desc' },
          include: {
            job: {
              include: {
                company: {
                  select: {
                    name: true,
                    logo: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            skills: true,
          },
        },
      },
    });

    if (!profile) return null;

    // Calculate profile completion
    const fields = [
      profile.headline,
      profile.bio,
      profile.resumeUrl,
      profile.preferredSalaryMin,
      profile.name,
    ];
    const completedFields = fields.filter(Boolean).length;

    // Add logic for arrays
    const arrayPoints = [
      profile.workExperience.length > 0,
      profile.education.length > 0,
      profile.skills.length > 0,
    ].filter(Boolean).length;

    const totalPossiblePoints = fields.length + 3;
    const currentPoints = completedFields + arrayPoints;
    const completionPercentage = Math.round((currentPoints / totalPossiblePoints) * 100);

    const interviewCount = await prisma.application.count({
      where: {
        seekerId: profile.id,
        status: 'INTERVIEWING',
      },
    });

    return {
      stats: {
        profileCompletion: completionPercentage,
        applicationsCount: profile._count.applications,
        interviewsScheduled: interviewCount,
        profileViews: profile?.views || 0,
        skillsCount: profile._count.skills,
        hasResume: !!profile.resumeUrl,
      },
      recentApplications: profile.applications,
      userName: profile.name,
    };
  },

  uploadResume: async (userId: string, file: Express.Multer.File) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`[Upload Resume] Starting upload for user: ${userId}`);
        console.log(`[Upload Resume] File Details: ${file.originalname} (${file.size} bytes, ${file.mimetype})`);

        const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
        if (!profile) {
          console.error(`[Upload Resume] Profile not found for user: ${userId}`);
          return reject(new Error("Profile not found"));
        }

        const fileExt = file.originalname.split('.').pop()?.toLowerCase();
        const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const publicIdWithExt = `jobspark/resumes/${uniqueId}.${fileExt}`;

        console.log(`[Upload Resume] Public ID: ${publicIdWithExt}`);

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            public_id: publicIdWithExt,
            access_mode: 'public',
          },
          async (error, result) => {
            if (error || !result) {
              console.error(`[Upload Resume] Cloudinary Upload Error:`, error);
              return reject(error || new Error("Failed to upload to Cloudinary"));
            }

            console.log(`[Upload Resume] Cloudinary Result:`, {
              public_id: result.public_id,
              resource_type: result.resource_type,
              secure_url: result.secure_url,
            });

            // Delete old resume from Cloudinary if it exists
            if (profile.resumeUrl && profile.resumeUrl.includes('jobspark/resumes/')) {
              try {
                const oldPublicId = 'jobspark/resumes/' + profile.resumeUrl.split('jobspark/resumes/')[1];
                await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' });
                console.log(`[Upload Resume] Deleted old resume from Cloudinary: ${oldPublicId}`);
              } catch (deleteError) {
                console.error(`[Upload Resume] Failed to delete old resume:`, deleteError);
              }
            }

            // ✅ Store plain secure_url — no fl_attachment needed anymore
            await prisma.jobSeekerProfile.update({
              where: { id: profile.id },
              data: { resumeUrl: result.secure_url },
            });

            console.log(`[Upload Resume] Stored URL in DB: ${result.secure_url}`);
            resolve({ resumeUrl: result.secure_url });
          }
        );

        uploadStream.end(file.buffer);
      } catch (error) {
        reject(error);
      }
    });
  },
};