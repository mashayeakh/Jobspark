import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";
import Groq from "groq-sdk";
import { envVars } from "../../../config/env";

const groq = new Groq({ apiKey: envVars.GROQ_API_KEY });

export const BlogGeneratorService = {
  generateBlog: async (topic: string) => {
    const prompt = `
      You are an expert content strategist and professional blogger for a high-end job platform called JobsPark.
      Your task is to generate a professional, engaging, and SEO-optimized blog post based on the following topic/prompt.

      Topic: ${topic}

      Please provide:
      1. A catchy, high-impact Title.
      2. A brief, engaging Excerpt (2 sentences).
      3. A professional Category (e.g., AI & Tech, Career Advice, Remote Work, Leadership, Industry Trends).
      4. Detailed Blog Content (4-5 paragraphs) formatted in clean HTML or Markdown.

      Output the result strictly as a JSON object, exactly like this:
      {
        "title": "...",
        "excerpt": "...",
        "category": "...",
        "content": "..."
      }

      Do not include any markdown formatting, code blocks, or extra text outside the JSON. Just the JSON object.
    `;

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      });

      const content = response.choices[0].message?.content?.trim() || "{}";
      
      try {
        const cleanedContent = content.replace(/```json\n?|```/g, '');
        const parsed = JSON.parse(cleanedContent);
        
        if (!parsed.title || !parsed.content) {
          throw new Error("Invalid format returned by AI.");
        }
        
        return parsed;
      } catch (e) {
        console.error("AI parse error:", content);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to parse AI generated blog content.");
      }
    } catch (error: any) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to generate blog from AI");
    }
  }
};
