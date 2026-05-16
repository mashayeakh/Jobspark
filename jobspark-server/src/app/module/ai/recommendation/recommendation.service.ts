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

// ── Heuristic-only formatter (used when Groq is rate-limited/unavailable) ────
function formatHeuristicResults(
  topJobs: Array<{ job: any; score: number }>,
  seekerSkillNames: string[]
): RecommendedJob[] {
  return topJobs
    .map(tj => {
      const jobSkillNames: string[] = tj.job.skills.map((s: any) => s.skill.name.toLowerCase());
      const matched = jobSkillNames.filter(s => seekerSkillNames.includes(s));

      return {
        jobId: tj.job.id,
        title: tj.job.title,
        companyName: tj.job.company.name,
        companyLogo: tj.job.company.logo || undefined,
        location: tj.job.location || "Remote",
        type: tj.job.type,
        salaryRange: tj.job.salaryMin
          ? `$${tj.job.salaryMin} - $${tj.job.salaryMax}`
          : "Negotiable",
        // Minimum baseline of 30 so user never sees 0%
        score: Math.round(tj.score) || 30,
        explanation:
          matched.length > 0
            ? `Matches your ${matched.slice(0, 2).join(" & ")} skills.`
            : `A ${tj.job.experienceLevel.toLowerCase()} role that fits your profile.`,
        matchReasons:
          matched.length > 0
            ? matched.slice(0, 3).map((s: string) => `Matches your ${s} skill`)
            : [
                `${tj.job.type.replace("_", " ")} position`,
                `Located in ${tj.job.location || "Global"}`,
              ],
      };
    })
    .sort((a, b) => b.score - a.score);
}

export const RecommendationService = {
  getRecommendedJobs: async (userId: string): Promise<RecommendedJob[]> => {
    // 1. Fetch seeker profile — throw 404 so caller can handle it
    const seeker = await prisma.jobSeekerProfile.findUnique({
      where: { userId },
      include: {
        skills: { include: { skill: true } },
        workExperience: true,
        education: true,
      },
    });

    if (!seeker) {
      throw new AppError(httpStatus.NOT_FOUND, "Job seeker profile not found");
    }

    // 2. Fetch active jobs
    const allJobs = await prisma.job.findMany({
      where: { status: { in: ["OPEN", "ACTIVE"] }, deletedAt: null },
      include: {
        skills: { include: { skill: true } },
        company: { select: { name: true, logo: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (allJobs.length === 0) return [];

    // 3. Heuristic scoring
    const seekerSkillNames = seeker.skills.map(s => s.skill.name.toLowerCase());

    const scoredJobs = allJobs.map(job => {
      let score = 0;

      const jobSkillNames = job.skills.map(s => s.skill.name.toLowerCase());
      const matchedSkills = jobSkillNames.filter(s => seekerSkillNames.includes(s));

      if (jobSkillNames.length > 0) {
        score += (matchedSkills.length / jobSkillNames.length) * 50;
      }

      // Experience bonus
      if (job.experienceLevel === "ENTRY"  && seeker.workExperience.length === 0) score += 20;
      if (job.experienceLevel === "MID"    && seeker.workExperience.length >= 2)  score += 20;
      if (job.experienceLevel === "SENIOR" && seeker.workExperience.length >= 5)  score += 20;

      // Bonus for any skill match
      if (matchedSkills.length > 0) score += 10;

      return { job, score };
    });

    // Top 20 shown; send only top 10 to Groq to save tokens (~60% fewer)
    const topJobs = scoredJobs.sort((a, b) => b.score - a.score).slice(0, 20);
    const jobsForAI = topJobs.slice(0, 10);

    console.log(`[RecommendationService] allJobs fetched: ${allJobs.length}`);
    console.log(`[RecommendationService] topJobs selected: ${topJobs.length}`);

    // 4. Try AI Enhancement — fall back gracefully on rate limit / error
    let aiRankings: any[] = [];

    try {
      const seekerSummary = `
        Skills: ${seeker.skills.map(s => s.skill.name).join(", ")}
        Experience: ${seeker.workExperience.map(w => `${w.title} at ${w.companyName}`).join(", ") || "None listed"}
        Bio: ${seeker.bio || "N/A"}
      `;

      // Short descriptions to minimise token usage
      const jobsData = jobsForAI.map(j => ({
        jobId: j.job.id,
        title: j.job.title,
        company: j.job.company.name,
        description: j.job.description.substring(0, 150),
        requiredSkills: j.job.skills.map(s => s.skill.name).join(", "),
      }));

      const prompt = `You are a job matching AI. Evaluate these ${jobsData.length} jobs for the seeker below.

SEEKER:
${seekerSummary}

JOBS:
${JSON.stringify(jobsData)}

Return ONLY a JSON object:
{
  "recommendations": [
    { "jobId": "...", "aiScore": 0.0-1.0, "explanation": "max 15 words", "matchReasons": ["reason1","reason2"] }
  ]
}`;

      const aiResponse = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a talent matching AI. Return only JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const raw = aiResponse.choices[0]?.message?.content || '{"recommendations":[]}';
      const parsed = JSON.parse(raw);
      aiRankings = Array.isArray(parsed)
        ? parsed
        : (parsed.recommendations || parsed.results || []);

      console.log(`[RecommendationService] AI rankings returned: ${aiRankings.length}`);

    } catch (aiError: any) {
      const isRateLimit = aiError?.status === 429 || aiError?.message?.includes("rate_limit");
      console.warn(
        isRateLimit
          ? "[RecommendationService] Groq daily limit reached — returning heuristic recommendations."
          : "[RecommendationService] Groq unavailable — returning heuristic recommendations.",
        aiError?.message ?? ""
      );

      // Always return heuristic results so the UI is never empty
      return formatHeuristicResults(topJobs, seekerSkillNames);
    }

    // 5. Merge AI scores into final list
    const finalRecommendations: RecommendedJob[] = topJobs.map(tj => {
      const aiMatch = aiRankings.find((r: any) => r.jobId === tj.job.id);
      const finalScore = aiMatch
        ? Math.round(aiMatch.aiScore * 100)
        : Math.round(tj.score) || 30;

      const jobSkillNames: string[] = tj.job.skills.map((s: any) => s.skill.name.toLowerCase());
      const matched = jobSkillNames.filter(s => seekerSkillNames.includes(s));

      return {
        jobId: tj.job.id,
        title: tj.job.title,
        companyName: tj.job.company.name,
        companyLogo: tj.job.company.logo || undefined,
        location: tj.job.location || "Remote",
        type: tj.job.type,
        salaryRange: tj.job.salaryMin
          ? `$${tj.job.salaryMin} - $${tj.job.salaryMax}`
          : "Negotiable",
        score: finalScore,
        explanation: aiMatch?.explanation ?? (matched.length > 0
          ? `Matches your ${matched.slice(0, 2).join(" & ")} skills.`
          : `A ${tj.job.experienceLevel.toLowerCase()} role that fits your profile.`),
        matchReasons: aiMatch?.matchReasons ?? (matched.length > 0
          ? matched.slice(0, 3).map((s: string) => `Matches your ${s} skill`)
          : [`${tj.job.type.replace("_", " ")} position`, `Located in ${tj.job.location || "Global"}`]),
      };
    }).sort((a, b) => b.score - a.score);

    return finalRecommendations;
  },
};
