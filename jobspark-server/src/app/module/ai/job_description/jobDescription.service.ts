import { AppError } from "@/app/errorHelpers/AppError";
import httpStatus from "http-status";

export const JobDescriptionService = {
  generateDescription: async (role: string, technologies: string, experience: string) => {
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "GROQ_API_KEY is not configured");
    }

    const prompt = `Write a professional and detailed job description for a ${role}. 
The candidate should have a ${experience} level of experience. 
Required technologies/skills: ${technologies}.

Available categories: Development, Design, Marketing, Business, Data & AI, Customer Support, Finance, Human Resources.

You MUST output the result as a strictly valid JSON object with EXACTLY these seven keys:
{
  "title": "A catchy and professional job title",
  "description": "A 2-3 paragraph summary of the role and culture",
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "requirements": ["Requirement 1", "Requirement 2"],
  "benefits": ["Benefit 1", "Benefit 2"],
  "skills": ["Skill 1", "Skill 2", "Skill 3"], // Array of up to 8 key skills/technologies
  "category": "The exact name of the most relevant category from the available list"
}
Do not include any extra chat, explanations, or markdown formatting (no \`\`\`json). Return ONLY the raw JSON object.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // Standard fast model on Groq
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Groq API Error: ${errorData}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      try {
        const parsedJSON = JSON.parse(content.replace(/```json\n?|```/g, ''));
        
        // Format arrays into bulleted lists
        if (Array.isArray(parsedJSON.responsibilities)) {
          parsedJSON.responsibilities = parsedJSON.responsibilities.map((r: string) => `• ${r}`).join('\n');
        }
        if (Array.isArray(parsedJSON.requirements)) {
          parsedJSON.requirements = parsedJSON.requirements.map((r: string) => `• ${r}`).join('\n');
        }
        if (Array.isArray(parsedJSON.benefits)) {
          parsedJSON.benefits = parsedJSON.benefits.map((r: string) => `• ${r}`).join('\n');
        }
        
        return parsedJSON;
      } catch (parseError) {
        console.error("AI Output:", content);
        throw new Error("Failed to parse AI response into JSON format.");
      }
    } catch (error: any) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "Failed to generate job description from AI");
    }
  }
};
