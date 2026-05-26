import { prisma } from '@/app/lib/prisma';
import { envVars } from '@/app/config/env';
import { AppError } from '@/app/errorHelpers/AppError';
import httpStatus from 'http-status';
import { sendEmail } from '@/app/Utils/sendEmail';
import { profileIncompleteEmail } from '@/app/template/profileIncompleteEmail';

const FRONTEND_URL = envVars.FRONTEND_URL || 'http://localhost:3000';

export const NewsletterService = {
  // ── Subscribe ─────────────────────────────────────────────────────
  subscribe: async (email: string, name?: string) => {
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.isActive) {
        throw new AppError(httpStatus.CONFLICT, 'This email is already subscribed.');
      }
      // Re-activate if they had unsubscribed
      const reactivated = await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true, name: name || existing.name },
      });
      return reactivated;
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email, name: name || null },
    });

    // Send welcome email (non-blocking)
    sendEmail({
      to: email,
      subject: 'Welcome to JobSpark! You\'re in. 🚀',
      templateName: 'welcome-newsletter',
      templateData: { name: name || 'there', frontendUrl: FRONTEND_URL },
    }).catch((err) => console.error('[Newsletter] Failed to send welcome email:', err));

    return subscriber;
  },

  // ── Send New Company Alerts ────────────────────────────────────────
  sendNewCompanyAlerts: async (companyId: string) => {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return;

    // Find job seekers whose expertise or interests match the company industry
    const matchingSeekers = await prisma.jobSeekerProfile.findMany({
      where: {
        OR: [
          { expertise: { has: company.industry } },
          { interests: { has: company.industry } },
        ],
      },
      include: {
        user: { select: { email: true, name: true } },
      },
    });

    console.log(`[Newsletter] Sending company alerts to ${matchingSeekers.length} seekers for "${company.name}"`);

    for (const seeker of matchingSeekers) {
      if (!seeker.user?.email) continue;
      sendEmail({
        to: seeker.user.email,
        subject: `${company.name} just joined JobSpark and is hiring! 🏢`,
        templateName: 'new-company-alert',
        templateData: {
          seekerName: seeker.user.name || seeker.name,
          companyName: company.name,
          industry: company.industry,
          frontendUrl: FRONTEND_URL,
        },
      }).catch((err) => console.error(`[Newsletter] Company alert failed for ${seeker.user?.email}:`, err));
    }
  },

  // ── Send Job Match Alerts ──────────────────────────────────────────
  sendJobMatchAlerts: async (jobId: string) => {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        company: true,
        skills: { include: { skill: true } },
      },
    });
    if (!job) return;

    const jobSkillNames = job.skills.map((js) => js.skill.name);

    // Find seekers who have at least one matching skill
    const matchingSeekers = await prisma.jobSeekerProfile.findMany({
      where: {
        AND: [
          // Has at least one of the job's skills
          {
            skills: {
              some: {
                skill: { name: { in: jobSkillNames } },
              },
            },
          },
          // Optionally: location match (if job has a location, seeker must match or be flexible)
          ...(job.location
            ? [
              {
                OR: [
                  { location: { contains: job.location, mode: 'insensitive' as const } },
                  { location: null },
                ],
              },
            ]
            : []),
        ],
      },
      include: {
        user: { select: { email: true, name: true } },
      },
      take: 200, // Safety cap
    });

    console.log(`[Newsletter] Sending job alerts to ${matchingSeekers.length} seekers for "${job.title}"`);

    for (const seeker of matchingSeekers) {
      if (!seeker.user?.email) continue;
      sendEmail({
        to: seeker.user.email,
        subject: `New job you might like: ${job.title} at ${job.company.name} ⚡`,
        templateName: 'new-job-alert',
        templateData: {
          seekerName: seeker.user.name || seeker.name,
          jobTitle: job.title,
          companyName: job.company.name,
          location: job.location,
          jobType: job.type,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          jobId: job.id,
          frontendUrl: FRONTEND_URL,
        },
      }).catch((err) => console.error(`[Newsletter] Job alert failed for ${seeker.user?.email}:`, err));
    }
  },

  // ── Weekly Digest ──────────────────────────────────────────────────
  sendWeeklyDigests: async () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const careerTips = [
      'Tailor your CV to each job description — even small tweaks boost your chances by 40%.',
      'Follow up 5–7 days after an interview if you haven\'t heard back. It shows initiative.',
      'Use the STAR method (Situation, Task, Action, Result) to structure your interview answers.',
      'Add quantifiable achievements to your profile — "Increased sales by 30%" beats "responsible for sales".',
      'Connect with recruiters on LinkedIn before you need a job — relationships pay off later.',
    ];
    const careerTip = careerTips[new Date().getDay() % careerTips.length];

    const weekOf = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Get all active job seekers
    const seekers = await prisma.jobSeekerProfile.findMany({
      include: {
        user: { select: { email: true, name: true } },
        skills: { include: { skill: true } },
      },
    });

    for (const seeker of seekers) {
      if (!seeker.user?.email) continue;

      const seekerSkillNames = seeker.skills.map((cs) => cs.skill.name);

      // Find new jobs from the past week matching seeker skills
      const matchingJobs = await prisma.job.findMany({
        where: {
          createdAt: { gte: oneWeekAgo },
          status: { in: ['OPEN', 'ACTIVE'] },
          deletedAt: null,
          ...(seekerSkillNames.length > 0
            ? {
              skills: {
                some: {
                  skill: { name: { in: seekerSkillNames } },
                },
              },
            }
            : {}),
        },
        include: { company: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      if (matchingJobs.length === 0) continue; // Skip if no matching jobs

      const jobsData = matchingJobs.map((j) => ({
        title: j.title,
        companyName: j.company.name,
        location: j.location,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
      }));

      sendEmail({
        to: seeker.user.email,
        subject: `📬 Your Weekly JobSpark Digest — ${matchingJobs.length} new jobs for you`,
        templateName: 'weekly-digest',
        templateData: {
          seekerName: seeker.user.name || seeker.name,
          newJobCount: matchingJobs.length,
          jobs: jobsData,
          careerTip,
          weekOf,
          frontendUrl: FRONTEND_URL,
        },
      }).catch((err) => console.error(`[Newsletter] Weekly digest failed for ${seeker.user?.email}:`, err));
    }

    console.log(`[Cron] Weekly digest sent to ${seekers.length} seekers.`);
  },

  // ── Profile Completion Reminder ────────────────────────────────────
  sendProfileReminders: async () => {
    const incompleteProfiles = await prisma.jobSeekerProfile.findMany({
      where: { isProfileComplete: false },
      include: {
        user: { select: { email: true, name: true } },
        skills: true,
      },
    });

    for (const profile of incompleteProfiles) {
      if (!profile.user?.email) continue;

      const missingItems: string[] = [];
      if (!profile.headline) missingItems.push('Professional headline');
      if (!profile.bio) missingItems.push('Bio / summary');
      if (!profile.location) missingItems.push('Location');
      if (profile.skills.length === 0) missingItems.push('Skills');
      if (!profile.resumeUrl) missingItems.push('Resume / CV');
      if (!profile.linkedinUrl) missingItems.push('LinkedIn URL');

      if (missingItems.length === 0) continue;

      const completionPercent = Math.round(((6 - missingItems.length) / 6) * 100);

      const htmlBody = profileIncompleteEmail({
        seekerName: profile.user.name || profile.name || 'Job Seeker',
        completionPercent,
        missingItems,
        frontendUrl: FRONTEND_URL,
        unsubscribeUrl: `${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(profile.user.email)}`,
      });

      sendEmail({
        to: profile.user.email,
        subject: `Your profile is ${completionPercent}% complete — finish it to get more matches`,
        htmlBody,
      }).catch((err) => console.error(`[Newsletter] Profile reminder failed for ${profile.user?.email}:`, err));
    }

    console.log(`[Cron] Profile reminders sent to ${incompleteProfiles.length} seekers.`);
  },

  // ── Inactivity Engagement ──────────────────────────────────────────
  sendInactivityEmails: async () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    // Find users who haven't logged in for 2+ weeks
    const inactiveUsers = await prisma.user.findMany({
      where: {
        role: 'JOB_SEEKER',
        updatedAt: { lt: twoWeeksAgo },
      },
      include: {
        jobSeekerProfile: true,
      },
      take: 500,
    });

    const [newJobsCount, newCompaniesCount] = await Promise.all([
      prisma.job.count({ where: { createdAt: { gte: twoWeeksAgo }, status: { in: ['OPEN', 'ACTIVE'] }, deletedAt: null } }),
      prisma.company.count({ where: { createdAt: { gte: twoWeeksAgo } } }),
    ]);

    for (const user of inactiveUsers) {
      if (!user.email) continue;
      const daysSinceLastVisit = Math.floor((Date.now() - new Date(user.updatedAt).getTime()) / (1000 * 60 * 60 * 24));

      sendEmail({
        to: user.email,
        subject: `You haven't visited in ${daysSinceLastVisit} days — here's what you missed 👀`,
        templateName: 'engagement-inactive',
        templateData: {
          seekerName: user.name,
          daysSinceLastVisit,
          newJobsCount,
          newCompaniesCount,
          hiringCitiesCount: 12,
          activeHiringCount: 10,
          topCity: 'Dhaka',
          frontendUrl: FRONTEND_URL,
        },
      }).catch((err) => console.error(`[Newsletter] Inactivity email failed for ${user.email}:`, err));
    }

    console.log(`[Cron] Inactivity emails sent to ${inactiveUsers.length} users.`);
  },
};
