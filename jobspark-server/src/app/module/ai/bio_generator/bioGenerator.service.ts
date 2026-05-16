import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import { envVars } from "../../../config/env";

const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

export const BioGeneratorService = {
  generateBios: async (headline: string, currentBio: string, skills: string[]) => {
    const prompt = `
      You are an expert career coach and resume writer. 
      A job seeker needs 3 professional bio options for their profile.
      
      Here is their information:
      Headline: ${headline || 'Not provided'}
      Current Draft Bio: ${currentBio || 'Not provided'}
      Skills: ${skills.join(", ") || 'Not provided'}

      Please generate 3 distinct bio options. Each should be 2-3 sentences.
      - Option 1: Professional and straightforward, focusing on their skills and role.
      - Option 2: Passionate and energetic, focusing on their drive and impact.
      - Option 3: Short and punchy, very concise and impactful.

      Output the result strictly as a JSON array of strings, exactly like this:
      ["Bio option 1...", "Bio option 2...", "Bio option 3..."]
      
      Do not include any markdown formatting, code blocks, or extra text. Just the JSON array.
    `;

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message?.content?.trim() || "[]";
      
      try {
        const parsed = JSON.parse(content.replace(/```json\n?|```/g, ''));
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed.slice(0, 3);
        }
        throw new Error("Invalid format returned by AI.");
      } catch (e) {
        console.error("AI parse error:", content);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to parse AI generated bios.");
      }
    } catch (error: any) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to generate bio from AI");
    }
  }
};
