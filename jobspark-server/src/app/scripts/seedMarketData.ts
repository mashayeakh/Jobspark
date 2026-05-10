import { prisma } from "../lib/prisma";
import { UserRole, JobType } from "prisma/generated/prisma/enums";

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Manufacturing",
  "Retail", "Consulting", "Media", "Transportation", "Real Estate",
  "Energy", "Agriculture", "Entertainment", "Legal", "Non-Profit"
];

const jobTitles = {
  "Technology": [
    "Senior Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer",
    "Data Scientist", "Machine Learning Engineer", "Product Manager", "UX Designer",
    "Full Stack Developer", "Cloud Architect", "Cybersecurity Analyst", "Mobile Developer"
  ],
  "Healthcare": [
    "Registered Nurse", "Medical Doctor", "Healthcare Administrator", "Medical Technician",
    "Physical Therapist", "Pharmacist", "Healthcare Analyst", "Medical Researcher"
  ],
  "Finance": [
    "Financial Analyst", "Investment Banker", "Accountant", "Risk Manager",
    "Financial Advisor", "Credit Analyst", "Treasury Analyst", "Compliance Officer"
  ],
  "Education": [
    "Teacher", "Professor", "Education Administrator", "Curriculum Developer",
    "Education Consultant", "Training Specialist", "Librarian", "Research Assistant"
  ]
};

const skills = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD",
  "Machine Learning", "Data Analysis", "SQL", "MongoDB", "PostgreSQL",
  "Project Management", "Agile", "Scrum", "Leadership", "Communication",
  "Marketing", "Sales", "Customer Service", "Problem Solving", "Critical Thinking"
];

const companies = [
  { name: "TechCorp Solutions", industry: "Technology", size: "Large", verified: true },
  { name: "HealthPlus Medical", industry: "Healthcare", size: "Medium", verified: true },
  { name: "FinanceHub Inc", industry: "Finance", size: "Large", verified: true },
  { name: "EduFirst Academy", industry: "Education", size: "Small", verified: false },
  { name: "RetailMax", industry: "Retail", size: "Large", verified: true },
  { name: "ConsultPro", industry: "Consulting", size: "Medium", verified: false },
  { name: "MediaWave", industry: "Media", size: "Small", verified: false },
  { name: "ManufacturingCo", industry: "Manufacturing", size: "Large", verified: true },
  { name: "TranspoLogistics", industry: "Transportation", size: "Medium", verified: true },
  { name: "EstatePro", industry: "Real Estate", size: "Small", verified: false },
  { name: "EnergyFuture", industry: "Energy", size: "Large", verified: true },
  { name: "AgriTech Solutions", industry: "Agriculture", size: "Medium", verified: false },
  { name: "EntertainNow", industry: "Entertainment", size: "Small", verified: false },
  { name: "LegalEagle", industry: "Legal", size: "Medium", verified: true },
  { name: "HelpingHands", industry: "Non-Profit", size: "Small", verified: false }
];

const jobDescriptions = [
  "We are looking for a talented professional to join our dynamic team. This role offers excellent growth opportunities and competitive compensation.",
  "Join our innovative company and make a real impact. We value creativity, collaboration, and continuous learning.",
  "Exciting opportunity for experienced professional to lead important projects and drive business success.",
  "Fast-growing company seeking motivated individual to contribute to our mission and vision.",
  "Be part of a forward-thinking organization that invests in its people and technology."
];

const locations = [
  "New York, NY", "San Francisco, CA", "London, UK", "Berlin, DE",
  "Tokyo, JP", "Singapore", "Toronto, CA", "Sydney, AU",
  "Chicago, IL", "Boston, MA", "Austin, TX", "Seattle, WA"
];

export const seedMarketData = async () => {
  try {
    console.log("🌱 Starting market data seeding...");

    // Create or find skills
    const createdSkills = [];
    for (const skillName of skills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName }
      });
      createdSkills.push(skill);
    }

    // Create companies
    const createdCompanies = [];
    for (const companyData of companies) {
      // Check if company exists first
      let company = await prisma.company.findFirst({
        where: { name: companyData.name }
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: companyData.name,
            website: `https://${companyData.name.toLowerCase().replace(/\s+/g, '')}.com`,
            industry: companyData.industry,
            size: companyData.size,
            isVerified: companyData.verified,
            description: `Leading ${companyData.industry} company with ${companyData.size.toLowerCase()} operations.`
          }
        });
      }

      createdCompanies.push(company);
    }

    // Create categories
    const categories = [
      "Engineering", "Healthcare", "Finance", "Education", "Sales",
      "Marketing", "Operations", "Management", "Design", "Data"
    ];

    const createdCategories = [];
    for (const categoryName of categories) {
      const category = await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: {
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-')
        }
      });
      createdCategories.push(category);
    }

    // Create recruiters and users
    const createdRecruiters = [];
    for (let i = 0; i < 10; i++) {
      const company = createdCompanies[i % createdCompanies.length];

      // Create user first
      const user = await prisma.user.upsert({
        where: { email: `recruiter${i + 1}@example.com` },
        update: {},
        create: {
          email: `recruiter${i + 1}@example.com`,
          name: `Recruiter ${i + 1}`,
          role: UserRole.RECRUITER,
          status: "ACTIVE",
          emailVerified: true
        }
      });

      // Create recruiter profile
      const recruiter = await prisma.recruiterProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          name: `Recruiter ${i + 1}`,
          companyId: company.id,
          position: "Hiring Manager"
        }
      });

      createdRecruiters.push(recruiter);
    }

    // Create jobs with varied dates for trend analysis
    const jobsToCreate = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const company = createdCompanies[i % createdCompanies.length];
      const industry = company.industry;
      const titles = jobTitles[industry as keyof typeof jobTitles] || jobTitles["Technology"];
      const title = titles[i % titles.length];
      const recruiter = createdRecruiters[i % createdRecruiters.length];
      const category = createdCategories[i % createdCategories.length];

      // Create jobs with different creation dates for trend analysis
      const daysAgo = Math.floor(Math.random() * 90); // Random date within last 90 days
      const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const job = {
        title,
        description: jobDescriptions[i % jobDescriptions.length] + ` This is a ${title} position in the ${industry} industry.`,
        requirements: `Bachelor's degree in relevant field. ${Math.floor(Math.random() * 5) + 3}+ years of experience preferred.`,
        benefits: "Health insurance, 401k, paid time off, professional development",
        salaryMin: Math.floor(Math.random() * 100000) + 50000,
        salaryMax: Math.floor(Math.random() * 150000) + 80000,
        location: locations[i % locations.length],
        type: Object.values(JobType)[i % Object.values(JobType).length],
        workStyle: undefined, // Remove workStyle as it's not in schema
        status: "OPEN" as const,
        companyId: company.id,
        recruiterId: recruiter.id,
        categoryId: category.id,
        createdAt,
        updatedAt: createdAt,
        applicationCount: Math.floor(Math.random() * 50),
        viewCount: Math.floor(Math.random() * 500) + 50
      };

      jobsToCreate.push(job);
    }

    // Create jobs
    const createdJobs = [];
    for (const jobData of jobsToCreate) {
      const job = await prisma.job.create({
        data: jobData
      });
      createdJobs.push(job);
    }

    // Add skills to jobs
    for (const job of createdJobs) {
      const numSkills = Math.floor(Math.random() * 5) + 2; // 2-6 skills per job
      const jobSkills = [];

      for (let i = 0; i < numSkills; i++) {
        const skill = createdSkills[Math.floor(Math.random() * createdSkills.length)];
        jobSkills.push({
          jobId: job.id,
          skillId: skill.id
        });
      }

      await prisma.jobSkill.createMany({
        data: jobSkills,
        skipDuplicates: true
      });
    }

    console.log(`✅ Market data seeding completed:`);
    console.log(`   - ${createdCompanies.length} companies`);
    console.log(`   - ${createdJobs.length} jobs`);
    console.log(`   - ${createdSkills.length} skills`);
    console.log(`   - ${createdCategories.length} categories`);
    console.log(`   - ${createdRecruiters.length} recruiters`);

  } catch (error) {
    console.error("❌ Error seeding market data:", error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMarketData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
