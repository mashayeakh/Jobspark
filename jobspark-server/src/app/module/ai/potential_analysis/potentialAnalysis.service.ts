import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import { envVars } from "../../../config/env";

const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

export interface PotentialAnalysisResult {
  score: number;
  matchLevel: "LOW" | "MEDIUM" | "HIGH" | "EXCELLENT";
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  skillMatchCount: number;
  totalRequiredSkills: number;
}

export const PotentialAnalysisService = {
  analyzeCandidatePotential: async (applicationId: string): Promise<PotentialAnalysisResult> => {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            skills: { include: { skill: true } },
            company: { select: { name: true } },
          },
        },
        seeker: {
          include: {
            skills: { include: { skill: true } },
            workExperience: { orderBy: { startDate: "desc" } },
            education: { orderBy: { startDate: "desc" } },
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!application) {
      throw new AppError(httpStatus.NOT_FOUND, "Application not found");
    }

    const { job, seeker } = application;

    // ── Pre-compute hard facts so the AI has precise data ──────────────────────
    const requiredSkillNames  = job.skills.map(s => s.skill.name.toLowerCase());
    const candidateSkillNames = seeker.skills.map(s => s.skill.name.toLowerCase());
    const matchedSkills       = requiredSkillNames.filter(s => candidateSkillNames.includes(s));
    const missingSkills       = requiredSkillNames.filter(s => !candidateSkillNames.includes(s));
    const extraSkills         = candidateSkillNames.filter(s => !requiredSkillNames.includes(s));

    const totalYearsExp = seeker.workExperience.reduce((sum, w) => {
      const start = new Date(w.startDate);
      const end   = w.endDate ? new Date(w.endDate) : new Date();
      return sum + (end.getFullYear() - start.getFullYear());
    }, 0);

    const skillMatchRate = requiredSkillNames.length > 0
      ? Math.round((matchedSkills.length / requiredSkillNames.length) * 100)
      : 100;

    const prompt = `You are an expert recruitment consultant. Analyze this candidate for the job and return an accurate, data-driven assessment.

JOB POSTING:
- Title: ${job.title}
- Company: ${job.company?.name || "N/A"}
- Experience Level Required: ${job.experienceLevel}
- Job Type: ${job.type}
- Required Skills: ${job.skills.map(s => s.skill.name).join(", ") || "Not specified"}
- Description: ${job.description.substring(0, 400)}
- Requirements: ${job.requirements?.substring(0, 300) || "See description"}
- Responsibilities: ${job.responsibilities?.substring(0, 300) || "See description"}

CANDIDATE PROFILE:
- Name: ${seeker.user.name}
- Bio: ${seeker.bio || "Not provided"}
- Headline: ${seeker.headline || "Not provided"}
- Total Experience: ~${totalYearsExp} years
- Skills: ${seeker.skills.map(s => `${s.skill.name} (${s.yearsExp ?? 0}yr${(s.yearsExp ?? 0) !== 1 ? "s" : ""})`).join(", ") || "None listed"}
- Work Experience: ${seeker.workExperience.map(w => `${w.title} at ${w.companyName}${w.description ? ` – ${w.description.substring(0, 100)}` : ""}`).join(" | ") || "None"}
- Education: ${seeker.education.map(e => `${e.degree} in ${e.field} from ${e.school}`).join(", ") || "Not listed"}

PRE-COMPUTED FACTS (use these for accuracy):
- Skill match rate: ${skillMatchRate}% (${matchedSkills.length}/${requiredSkillNames.length} required skills matched)
- Matched skills: ${matchedSkills.join(", ") || "None"}
- Missing skills: ${missingSkills.join(", ") || "None"}
- Bonus skills (not required but useful): ${extraSkills.join(", ") || "None"}

SCORING GUIDE:
- 85–100: EXCELLENT fit — nearly all skills matched, relevant experience, strong education
- 65–84: HIGH fit — most key skills present, good experience
- 40–64: MEDIUM fit — partial skill match, some relevant experience
- 0–39: LOW fit — significant skill or experience gaps

Return ONLY a JSON object with this exact structure:
{
  "score": <integer 0-100 based strictly on the data above>,
  "matchLevel": "<LOW|MEDIUM|HIGH|EXCELLENT>",
  "summary": "<2-3 sentence summary of the candidate's fit for this specific role>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "gaps": ["<specific gap 1>", "<specific gap 2>"],
  "recommendation": "<1-2 sentence recruiter recommendation: should they interview, shortlist, or pass?>"
}`;

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert recruitment consultant. Analyze candidates objectively and accurately. Return only valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const raw = response.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw);

      // Validate / clamp the score
      const score = Math.max(0, Math.min(100, Number(parsed.score) || skillMatchRate));

      return {
        score,
        matchLevel: parsed.matchLevel ?? (
          score >= 85 ? "EXCELLENT" :
          score >= 65 ? "HIGH" :
          score >= 40 ? "MEDIUM" : "LOW"
        ),
        summary:        parsed.summary        ?? "Analysis completed.",
        strengths:      Array.isArray(parsed.strengths) ? parsed.strengths : [],
        gaps:           Array.isArray(parsed.gaps)      ? parsed.gaps      : [],
        recommendation: parsed.recommendation ?? "Review candidate profile carefully.",
        // Attach pre-computed facts for the frontend to use
        skillMatchCount:      matchedSkills.length,
        totalRequiredSkills:  requiredSkillNames.length,
      };

    } catch (aiError: any) {
      const isRateLimit = aiError?.status === 429 || aiError?.message?.includes("rate_limit");
      console.warn(
        isRateLimit
          ? "[PotentialAnalysis] Groq rate limit — using heuristic fallback."
          : "[PotentialAnalysis] Groq error — using heuristic fallback.",
        aiError?.message ?? ""
      );

      // Heuristic fallback so the button always shows something useful
      const score = skillMatchRate;
      const matchLevel: PotentialAnalysisResult["matchLevel"] =
        score >= 85 ? "EXCELLENT" :
        score >= 65 ? "HIGH" :
        score >= 40 ? "MEDIUM" : "LOW";

      return {
        score,
        matchLevel,
        summary: `${seeker.user.name} matches ${matchedSkills.length} of ${requiredSkillNames.length} required skills for the ${job.title} role.`,
        strengths: matchedSkills.slice(0, 3).map(s => `Has required skill: ${s}`),
        gaps: missingSkills.slice(0, 3).map(s => `Missing required skill: ${s}`),
        recommendation: score >= 65
          ? "Candidate looks promising based on skill match. Recommend scheduling an interview."
          : "Candidate has significant skill gaps. Consider carefully before proceeding.",
        skillMatchCount: matchedSkills.length,
        totalRequiredSkills: requiredSkillNames.length,
      };
    }
  },
};
