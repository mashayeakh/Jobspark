import { prisma } from "../../../lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import { envVars } from "../../../config/env";

const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

export interface PotentialAnalysisResult {
  score: number;
  matchLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXCELLENT';
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

export const PotentialAnalysisService = {
  analyzeCandidatePotential: async (applicationId: string): Promise<PotentialAnalysisResult> => {
    try {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          job: {
            include: {
              skills: { include: { skill: true } }
            }
          },
          seeker: {
            include: {
              skills: { include: { skill: true } },
              workExperience: true,
              education: true,
              user: { select: { name: true, email: true } }
            }
          }
        }
      });

      if (!application) {
        throw new AppError(httpStatus.NOT_FOUND, "Application not found");
      }

      const { job, seeker } = application;

      const prompt = `
      Analyze the potential of a candidate for a specific job posting. 
      Compare the candidate's skills, experience, and education with the job's requirements and responsibilities.

      JOB DETAILS:
      Title: ${job.title}
      Description: ${job.description}
      Requirements: ${job.requirements || 'N/A'}
      Responsibilities: ${job.responsibilities || 'N/A'}
      Required Skills: ${job.skills.map(s => s.skill.name).join(', ')}

      CANDIDATE DETAILS:
      Name: ${seeker.name}
      Headline: ${seeker.headline || 'N/A'}
      Bio: ${seeker.bio || 'N/A'}
      Skills: ${seeker.skills.map(s => `${s.skill.name} (Level: ${s.level}, Exp: ${s.yearsExp}yrs)`).join(', ')}
      Work Experience: ${seeker.workExperience.map(w => `${w.title} at ${w.companyName} (${w.description || ''})`).join('; ')}
      Education: ${seeker.education.map(e => `${e.degree} in ${e.field} from ${e.school}`).join('; ')}

      Provide a comprehensive analysis including:
      1. A match score from 0 to 100.
      2. Match level (LOW, MEDIUM, HIGH, EXCELLENT).
      3. A brief summary of the candidate's fit.
      4. Key strengths that match the job.
      5. Potential gaps or areas for improvement.
      6. A final recommendation for the recruiter.

      Return ONLY a raw JSON object:
      {
        "score": number,
        "matchLevel": "LOW" | "MEDIUM" | "HIGH" | "EXCELLENT",
        "summary": "string",
        "strengths": ["string"],
        "gaps": ["string"],
        "recommendation": "string"
      }
      `;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert recruitment consultant and AI talent analyzer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const text = response.choices[0]?.message?.content ?? "";
      return JSON.parse(text);

    } catch (error) {
      console.error("Potential analysis error:", error);
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Potential analysis failed");
    }
  }
};
