import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import { envVars } from "../../../config/env";

const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

export interface RecommendedJob {
  jobId: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  type: string;
  salaryRange?: string;
  score: number;
  explanation: string;
  matchReasons: string[];
}

export const RecommendationService = {
  getRecommendedJobs: async (userId: string): Promise<RecommendedJob[]> => {
    try {
      // 1. Fetch Job Seeker Profile
      const seeker = await prisma.jobSeekerProfile.findUnique({
        where: { userId },
        include: {
          skills: { include: { skill: true } },
          workExperience: true,
          education: true
        }
      });

      if (!seeker) {
        throw new AppError(httpStatus.NOT_FOUND, "Job seeker profile not found");
      }

      // 2. Fetch All Open Jobs (Filter by basic status)
      const allJobs = await prisma.job.findMany({
        where: { 
          status: { in: ['OPEN', 'ACTIVE'] },
          deletedAt: null
        },
        include: {
          skills: { include: { skill: true } },
          company: { select: { name: true, logo: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 50 // Take top 50 for initial screening
      });

      if (allJobs.length === 0) {
        return [];
      }

      // 3. Initial Fast Scoring (Heuristics)
      const scoredJobs = allJobs.map(job => {
        let score = 0;
        
        // Skill Matching (Heuristic)
        const jobSkillNames = job.skills.map(s => s.skill.name.toLowerCase());
        const seekerSkillNames = seeker.skills.map(s => s.skill.name.toLowerCase());
        const matchedSkills = jobSkillNames.filter(s => seekerSkillNames.includes(s));
        
        if (jobSkillNames.length > 0) {
          score += (matchedSkills.length / jobSkillNames.length) * 50;
        }

        // Experience Level Match
        if (job.experienceLevel === 'ENTRY' && seeker.workExperience.length === 0) score += 20;
        if (job.experienceLevel === 'MID' && seeker.workExperience.length >= 2) score += 20;
        if (job.experienceLevel === 'SENIOR' && seeker.workExperience.length >= 5) score += 20;

        // Salary/Location Match could be added here
        
        return { job, score };
      });

      // Sort and take top 20 for AI enhancement to increase variety
      const topJobs = scoredJobs
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

      console.log(`[RecommendationService] allJobs fetched: ${allJobs.length}`);
      console.log(`[RecommendationService] topJobs selected: ${topJobs.length}`);

      // 4. AI Enhancement with Groq
      const seekerSummary = `
        Skills: ${seeker.skills.map(s => s.skill.name).join(', ')}
        Experiences: ${seeker.workExperience.map(w => `${w.title} at ${w.companyName}`).join(', ')}
        Bio: ${seeker.bio || 'N/A'}
      `;

      const jobsData = topJobs.map(j => ({
        id: j.job.id,
        title: j.job.title,
        company: j.job.company.name,
        description: j.job.description.substring(0, 300) + '...',
        requiredSkills: j.job.skills.map(s => s.skill.name).join(', ')
      }));

      const prompt = `
        You are an AI Job Matching Assistant.
        Given a Job Seeker's Profile and a list of Job Postings, evaluate the semantic fit for each job.
        
        SEEKER PROFILE:
        ${seekerSummary}
        
        JOB LISTINGS:
        ${JSON.stringify(jobsData, null, 2)}
        
        For each job, provide:
        1. A normalized match score (0.0 to 1.0). Be precise (e.g. 0.85). If the job fits their bio and skills well, score it high (0.7-1.0). If it's unrelated, score it low (0.0-0.3).
        2. A short "Why this job?" explanation (max 15 words) that specifically references their Bio or Skills.
        3. 2-3 specific match reasons (e.g., "Matches your Node.js skill", "Aligns with your bio").
        
        Return ONLY a JSON array of objects with this structure:
        [
          {
            "jobId": "...",
            "aiScore": number,
            "explanation": "string",
            "matchReasons": ["string"]
          }
        ]
      `;

      const aiResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional talent matching AI. Return only JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const aiResult = JSON.parse(aiResponse.choices[0]?.message?.content || '{"results":[]}');
      const aiRankings = Array.isArray(aiResult) ? aiResult : (aiResult.results || []);

      console.log(`[RecommendationService] AI Rankings returned: ${aiRankings.length}`);
      console.log(`[RecommendationService] AI Raw Output:`, aiResponse.choices[0]?.message?.content);

      // 5. Final Ranking & Formatting
      const finalRecommendations: RecommendedJob[] = topJobs.map(tj => {
        const aiMatch = aiRankings.find((r: any) => r.jobId === tj.job.id);
        const finalScore = aiMatch ? (aiMatch.aiScore * 100) : tj.score;

        return {
          jobId: tj.job.id,
          title: tj.job.title,
          companyName: tj.job.company.name,
          companyLogo: tj.job.company.logo || undefined,
          location: tj.job.location || 'Remote',
          type: tj.job.type,
          salaryRange: tj.job.salaryMin ? `$${tj.job.salaryMin} - $${tj.job.salaryMax}` : 'Negotiable',
          score: Math.round(finalScore),
          explanation: aiMatch?.explanation || `Matches ${tj.job.skills.length} of your core skills.`,
          matchReasons: aiMatch?.matchReasons || [`${tj.job.type} position`, `Located in ${tj.job.location || 'Global'}`]
        };
      }).sort((a, b) => b.score - a.score);

      return finalRecommendations;

    } catch (error) {
      console.error("Recommendation Error:", error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to generate recommendations");
    }
  }
};
