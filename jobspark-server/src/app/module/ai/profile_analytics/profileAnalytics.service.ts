
import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";

export const ProfileAnalyticsService = {
  getProfileCompleteness: async (userId: string) => {
    console.log(`[Analytics] Fetching score for User: ${userId}`);
    
    const seeker = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { image: true, name: true } },
        skills: true,
        workExperience: true,
        education: true,
      },
    });

    if (!seeker) {
      console.error(`[Analytics] No JobSeekerProfile found for UserID: ${userId}`);
      throw new AppError(httpStatus.NOT_FOUND, "Job seeker profile not found. Please create your profile first.");
    }

    console.log(`[Analytics] Found Profile: ${seeker.name}, Skills: ${seeker.skills.length}, Exp: ${seeker.workExperience.length}`);

    // --- STRICT SCORING LOGIC ---
    let score = 0;
    const details = [];

    // 1. Basic Profile (10%) - Bio must be long & Headline must exist
    const hasBio = seeker.bio && seeker.bio.length > 50;
    const hasHeadline = seeker.headline && seeker.headline.length > 10;
    if (hasBio && hasHeadline) {
      score += 10;
      details.push({ label: "Professional Bio & Headline", completed: true, weight: 10 });
    } else {
      details.push({ label: "Professional Bio & Headline", completed: false, weight: 10 });
    }

    // 2. Resume (15%)
    if (seeker.resumeUrl) {
      score += 15;
      details.push({ label: "ATS-Optimized Resume", completed: true, weight: 15 });
    } else {
      details.push({ label: "ATS-Optimized Resume", completed: false, weight: 15 });
    }

    // 3. Work Experience (20%) - Needs at least 2 for full marks
    if (seeker.workExperience.length >= 2) {
      score += 20;
      details.push({ label: "Experience Depth (2+ Roles)", completed: true, weight: 20 });
    } else if (seeker.workExperience.length === 1) {
      score += 10;
      details.push({ label: "Experience Depth (Needs 1 more)", completed: false, weight: 20 });
    } else {
      details.push({ label: "Experience Depth", completed: false, weight: 20 });
    }

    // 4. Education (10%)
    if (seeker.education.length >= 1) {
      score += 10;
      details.push({ label: "Education History", completed: true, weight: 10 });
    } else {
      details.push({ label: "Education History", completed: false, weight: 10 });
    }

    // 5. Skills Quantity (15%) - Needs at least 10 skills
    if (seeker.skills.length >= 10) {
      score += 15;
      details.push({ label: "Skills Breadth (10+ Skills)", completed: true, weight: 15 });
    } else {
      const partial = Math.floor((seeker.skills.length / 10) * 15);
      score += partial;
      details.push({ label: `Skills Breadth (${seeker.skills.length}/10)`, completed: false, weight: 15 });
    }

    // 6. Elite Skill Gap Analysis (20%) - STRICT AI CHECK
    const resumeText = (seeker.bio + " " + (seeker.headline || "") + " " + seeker.skills.map(s => s.skillId).join(" ")).toLowerCase();
    const isDev = resumeText.includes("engineer") || resumeText.includes("developer");
    
    if (isDev) {
      const eliteSkills = ["docker", "kubernetes", "aws", "cloud", "system design", "unit testing", "ci/cd", "microservices"];
      const foundElite = eliteSkills.filter(s => resumeText.includes(s));
      
      if (foundElite.length >= 3) {
        score += 20;
        details.push({ label: "Elite Tech Stack (DevOps/Cloud)", completed: true, weight: 20 });
      } else {
        details.push({ label: `Elite Gap: Missing ${3 - foundElite.length} Senior Skills`, completed: false, weight: 20 });
      }
    } else {
      score += 10; // Non-devs get a neutral baseline
      details.push({ label: "Industry Specialization", completed: false, weight: 20 });
    }

    // 7. Identity (10%)
    if (seeker.user?.image) {
      score += 10;
      details.push({ label: "Professional Photo", completed: true, weight: 10 });
    } else {
      details.push({ label: "Professional Photo", completed: false, weight: 10 });
    }

    // --- DYNAMIC AI RECOMMENDATION ENGINE ---
    let feedback = "";
    const firstName = seeker.user.name?.split(" ")[0] || "there";

    if (score >= 95) {
      feedback = `Incredible job, ${firstName}! Your profile is in the top 1% of all candidates. You're ready for elite senior roles.`;
    } else if (score >= 80) {
      feedback = `You're doing great, ${firstName}! You have a very strong foundation. To hit that 100% 'Elite' status, consider adding a few more high-impact certifications or niche senior skills.`;
    } else if (score >= 50) {
      const missingElite = details.find(d => d.label.includes("Elite Gap"));
      const missingExp = details.find(d => d.label.includes("Experience Depth"));
      
      feedback = `Solid start, ${firstName}! You've got the basics down. `;
      if (missingElite && !missingElite.completed) {
        feedback += "However, top-tier companies look for 'Elite' keywords like Docker or AWS which are currently missing. ";
      }
      if (missingExp && !missingExp.completed) {
        feedback += "Adding one more past role would also significantly boost your credibility.";
      }
    } else {
      feedback = `Welcome, ${firstName}! You're just starting your journey. Focus on filling out your Bio and adding at least 10 skills to help our AI match you with the right jobs.`;
    }

    return {
      totalScore: Math.min(score, 100),
      breakdown: details,
      missingSections: details.filter(d => !d.completed).map(d => d.label),
      recommendation: feedback
    };
  }
};
