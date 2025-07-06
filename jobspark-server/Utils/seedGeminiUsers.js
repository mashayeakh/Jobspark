// this will run once we store gemini users into the db
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("../Model/AccountModel/UserModel");

dotenv.config();

// we will first craete a sample users array with some data
const DEFAULT_PASSWORD = "aipass123"
const universities = [
    "MIT", "Stanford University", "Harvard", "University of Oxford", "University of Cambridge",
    "Caltech", "UC Berkeley", "University of Tokyo", "University of Toronto", "ETH Zurich"
];

const roles = [
    "Frontend Developer", "Backend Developer", "Fullstack Developer", "Data Analyst", "DevOps Engineer"
];

const jobTitles = [
    ["Frontend Developer", "UI Engineer"],
    ["Backend Developer", "API Specialist"],
    ["Fullstack Developer", "MERN Stack Developer"],
    ["Data Analyst", "Business Intelligence Analyst"],
    ["DevOps Engineer", "Site Reliability Engineer"]
];

const preferredLocations = [
    "New York, USA", "San Francisco, USA", "Toronto, Canada", "London, UK", "Tokyo, Japan"
];

const location = [
    "New York, NY",
    "San Francisco, CA",
    "Austin, TX",
    "Seattle, WA",
    "Chicago, IL",
    "Boston, MA",
    "Los Angeles, CA",
    "Denver, CO",
    "Atlanta, GA",
    "Miami, FL"
];

const experienceLevel = ["Junior", "Mid", "Senior"];

const skills = [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Express.js",
    "HTML",
    "CSS",
    "Redux",
    "TypeScript",
    "REST API",
    "Git",
    "Docker",
    "Jest",
    "GraphQL"
];

function getRandomSkills(skillPool, count = 3) {
    const shuffled = [...skillPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}


const sampleUsers = [...Array(50)].map((_, i) => {
    const randomIndex = Math.floor(Math.random() * roles.length);
    const expLevel = experienceLevel[i % experienceLevel.length];
    const loc = location[i % location.length];
    const s = getRandomSkills(skills, Math.floor(Math.random() * 3) + 3); // 3–5 skills

    return {
        name: `Gemini User ${i + 1}`,
        email: `geminiuser${i + 1}@aiuse.com`,
        password: DEFAULT_PASSWORD,
        location: loc,
        role: "job_seeker",
        skills: s,
        experienceLevel: expLevel,
        jobSeekerProfile: {
            university: universities[Math.floor(Math.random() * universities.length)],
            roles: roles[randomIndex],
            preferredJobTitles: jobTitles[randomIndex],
            preferredLocations: [preferredLocations[Math.floor(Math.random() * preferredLocations.length)]],
            isProfileComplete: true,
        },
        isGeneratedByAI: true,
    };
});

//now create a func to insert this into db. 
const seedGeminiUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTED TO MONGODB");


        // const deleted = await UserModel.deleteMany({ isGeneratedByAI: true });
        // console.log(`🗑️ Deleted ${deleted.deletedCount} existing AI users`);

        const existing = await UserModel.find({ isGeneratedByAI: true });
        if (existing.length > 0) {
            console.log("⚠️ AI users already exist. Skipping seeding.");
            return;
        }

        const result = await UserModel.insertMany(sampleUsers);
        console.log("50 Gemini users added successfully. ");
        process.exit(0);
    } catch (err) {
        console.log("ERR ", err);
        process.exit(1);
    }
}

seedGeminiUsers();