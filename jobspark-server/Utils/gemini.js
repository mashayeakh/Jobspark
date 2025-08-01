const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getRecommendedUsers(promptText) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(promptText);
        const text = await result.response.text();

        return text;
    } catch (error) {
        console.error("Gemini Error:", error.message);
        return null;
    }
}

//generating remainder for profile 
const generateProfileReminder = async (userName) => {
    const prompt = `
You are a polite assistant helping users complete their job portal profiles. Write a friendly message in less than 30 words encouraging a user named "${userName}" to complete their profile. Avoid sounding robotic.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim();

        return text;
    } catch (err) {
        console.error("Gemini message generation error:", err);
        return `Hi ${userName}, don’t forget to complete your profile to unlock new opportunities!`;
    }
};

module.exports = { getRecommendedUsers, generateProfileReminder }