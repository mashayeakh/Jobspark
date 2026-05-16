
import bcrypt from "bcryptjs";
import { ExperienceLevel, JobStatus, JobType, LocationType, PrismaClient, UserRole } from "./generated/prisma/client";
import { prisma } from "../src/app/lib/prisma";


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomSubset<T>(arr: T[], min = 1, max = 3): T[] {
    const count = randomInt(min, Math.min(max, arr.length));
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
}
function futureDate(daysAhead: number) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d;
}

// ─────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────
const PASSWORD_HASH = await bcrypt.hash("Password123!", 10);

const COMPANIES = [
    {
        name: "TechNova Solutions",
        industry: "Information Technology",
        size: "201-500",
        location: "Dhaka, Bangladesh",
        website: "https://technova.io",
        description: "Building the next generation of enterprise software solutions.",
        tagline: "Innovate. Build. Scale.",
        mission: "To empower businesses through cutting-edge technology.",
        benefits: "Health insurance, remote work, annual bonus, training budget",
        foundedYear: "2015",
        headquarters: "Dhaka, Bangladesh",
        email: "hr@technova.io",
        phone: "+880-1700-000001",
        isVerified: true,
    },
    {
        name: "GreenBridge Finance",
        industry: "Financial Services",
        size: "501-1000",
        location: "Chittagong, Bangladesh",
        website: "https://greenbridge.finance",
        description: "Democratizing financial services for SMEs across South Asia.",
        tagline: "Finance for Everyone.",
        mission: "Make financial tools accessible and transparent.",
        benefits: "Provident fund, medical coverage, flexible hours",
        foundedYear: "2012",
        headquarters: "Chittagong, Bangladesh",
        email: "careers@greenbridge.finance",
        phone: "+880-1700-000002",
        isVerified: true,
    },
    {
        name: "PixelCraft Agency",
        industry: "Creative & Design",
        size: "11-50",
        location: "Dhaka, Bangladesh",
        website: "https://pixelcraft.agency",
        description: "Award-winning creative agency specialising in branding and digital experience.",
        tagline: "We make beautiful things.",
        mission: "Turn brand visions into compelling visual stories.",
        benefits: "Creative environment, MacBook provided, quarterly retreats",
        foundedYear: "2018",
        headquarters: "Dhaka, Bangladesh",
        email: "hello@pixelcraft.agency",
        phone: "+880-1700-000003",
        isVerified: false,
    },
    {
        name: "MediPath Healthcare",
        industry: "Healthcare",
        size: "1001-5000",
        location: "Sylhet, Bangladesh",
        website: "https://medipath.health",
        description: "Connecting patients with quality healthcare across Bangladesh.",
        tagline: "Health Without Borders.",
        mission: "Improve healthcare access through technology.",
        benefits: "Free medical checkups, life insurance, childcare allowance",
        foundedYear: "2010",
        headquarters: "Sylhet, Bangladesh",
        email: "talent@medipath.health",
        phone: "+880-1700-000004",
        isVerified: true,
    },
    {
        name: "EduRocket",
        industry: "Education Technology",
        size: "51-200",
        location: "Dhaka, Bangladesh",
        website: "https://edurocket.edu",
        description: "Online learning platform with 2M+ learners across South Asia.",
        tagline: "Learn. Grow. Launch.",
        mission: "Make quality education affordable for everyone.",
        benefits: "Free courses, work from home, equity options",
        foundedYear: "2019",
        headquarters: "Dhaka, Bangladesh",
        email: "jobs@edurocket.edu",
        phone: "+880-1700-000005",
        isVerified: true,
    },
    {
        name: "LogiFlow Logistics",
        industry: "Supply Chain & Logistics",
        size: "201-500",
        location: "Narayanganj, Bangladesh",
        website: "https://logiflow.bd",
        description: "Smart logistics and last-mile delivery solutions for e-commerce.",
        tagline: "Delivered. On Time. Every Time.",
        mission: "Simplify supply chains with intelligent automation.",
        benefits: "Transport allowance, annual bonus, health card",
        foundedYear: "2016",
        headquarters: "Narayanganj, Bangladesh",
        email: "hr@logiflow.bd",
        phone: "+880-1700-000006",
        isVerified: false,
    },
    {
        name: "CloudBase Systems",
        industry: "Cloud Computing",
        size: "51-200",
        location: "Dhaka, Bangladesh",
        website: "https://cloudbase.systems",
        description: "Cloud infrastructure and DevOps solutions for growing startups.",
        tagline: "Scale Without Limits.",
        mission: "Help companies move to cloud with zero friction.",
        benefits: "Stock options, remote-first, AWS/GCP certifications sponsored",
        foundedYear: "2020",
        headquarters: "Dhaka, Bangladesh",
        email: "recruit@cloudbase.systems",
        phone: "+880-1700-000007",
        isVerified: true,
    },
    {
        name: "RetailX",
        industry: "E-Commerce & Retail",
        size: "501-1000",
        location: "Dhaka, Bangladesh",
        website: "https://retailx.com.bd",
        description: "Bangladesh's fastest-growing B2B e-commerce marketplace.",
        tagline: "Your Business, Supercharged.",
        mission: "Digitise retail for Bangladeshi SMEs.",
        benefits: "Staff discounts, monthly performance bonus, gym access",
        foundedYear: "2017",
        headquarters: "Dhaka, Bangladesh",
        email: "people@retailx.com.bd",
        phone: "+880-1700-000008",
        isVerified: true,
    },
];

const RECRUITERS = [
    { name: "Arif Hossain", position: "HR Manager", bio: "Passionate about connecting talent with opportunity.", phone: "+880-1800-100001" },
    { name: "Nusrat Jahan", position: "Talent Acquisition Lead", bio: "8 years recruiting in fintech.", phone: "+880-1800-100002" },
    { name: "Tanvir Ahmed", position: "Creative Director / HR", bio: "Designer turned recruiter who loves creative teams.", phone: "+880-1800-100003" },
    { name: "Fatema Begum", position: "Head of People Ops", bio: "Building diverse, inclusive teams in healthcare.", phone: "+880-1800-100004" },
    { name: "Sabbir Rahman", position: "Recruitment Specialist", bio: "Edtech evangelist helping teachers find great roles.", phone: "+880-1800-100005" },
    { name: "Dilruba Khatun", position: "HR Business Partner", bio: "Operations and logistics talent is my speciality.", phone: "+880-1800-100006" },
    { name: "Mushfiq Islam", position: "Engineering Recruiter", bio: "DevOps and cloud talent hunter since 2018.", phone: "+880-1800-100007" },
    { name: "Shirin Akter", position: "Senior HR Executive", bio: "Retail and e-commerce recruiting expert.", phone: "+880-1800-100008" },
];

const CATEGORIES_DATA = [
    {
        name: "Software & Engineering",
        slug: "software-engineering",
        icon: "💻",
        color: "#4F46E5",
        subcategories: [
            { name: "Frontend Development", slug: "frontend-development" },
            { name: "Backend Development", slug: "backend-development" },
            { name: "DevOps & Cloud", slug: "devops-cloud" },
            { name: "Mobile Development", slug: "mobile-development" },
            { name: "Data Engineering", slug: "data-engineering" },
        ],
    },
    {
        name: "Design & Creative",
        slug: "design-creative",
        icon: "🎨",
        color: "#EC4899",
        subcategories: [
            { name: "UI/UX Design", slug: "ui-ux-design" },
            { name: "Graphic Design", slug: "graphic-design" },
            { name: "Video Production", slug: "video-production" },
        ],
    },
    {
        name: "Finance & Accounting",
        slug: "finance-accounting",
        icon: "💰",
        color: "#10B981",
        subcategories: [
            { name: "Accounting", slug: "accounting" },
            { name: "Investment Banking", slug: "investment-banking" },
            { name: "Financial Analysis", slug: "financial-analysis" },
        ],
    },
    {
        name: "Healthcare",
        slug: "healthcare",
        icon: "🏥",
        color: "#EF4444",
        subcategories: [
            { name: "Clinical", slug: "clinical" },
            { name: "Health IT", slug: "health-it" },
            { name: "Administration", slug: "health-administration" },
        ],
    },
    {
        name: "Education",
        slug: "education",
        icon: "📚",
        color: "#F59E0B",
        subcategories: [
            { name: "Teaching", slug: "teaching" },
            { name: "Curriculum Design", slug: "curriculum-design" },
            { name: "EdTech Product", slug: "edtech-product" },
        ],
    },
    {
        name: "Operations & Logistics",
        slug: "operations-logistics",
        icon: "🚚",
        color: "#6366F1",
        subcategories: [
            { name: "Supply Chain", slug: "supply-chain" },
            { name: "Warehouse Ops", slug: "warehouse-ops" },
            { name: "Fleet Management", slug: "fleet-management" },
        ],
    },
    {
        name: "Marketing & Sales",
        slug: "marketing-sales",
        icon: "📢",
        color: "#F97316",
        subcategories: [
            { name: "Digital Marketing", slug: "digital-marketing" },
            { name: "Sales", slug: "sales" },
            { name: "Content Creation", slug: "content-creation" },
        ],
    },
];

const SKILLS_LIST = [
    "React", "Node.js", "TypeScript", "Python", "PostgreSQL", "MongoDB",
    "Docker", "Kubernetes", "AWS", "GCP", "Figma", "Adobe XD",
    "Financial Modelling", "Excel", "SQL", "Data Analysis", "Communication",
    "Project Management", "Agile", "Scrum", "GraphQL", "REST API",
    "Next.js", "Vue.js", "TailwindCSS", "DevOps", "CI/CD",
    "Healthcare Administration", "Medical Coding", "EMR Systems",
    "Curriculum Design", "LMS Platforms", "Content Writing",
    "SEO", "Google Ads", "Social Media Marketing", "Logistics Planning",
];

const WORK_STYLES = [
    { label: "Fully Remote", value: "fully_remote" },
    { label: "Hybrid", value: "hybrid" },
    { label: "On-site", value: "onsite" },
    { label: "Flexible", value: "flexible" },
];

// ─── Job templates per company index ───────────────────────────────────────
const JOB_TEMPLATES: Record<number, Array<{
    title: string;
    description: string;
    responsibilities: string;
    requirements: string;
    type: JobType;
    locationType: LocationType;
    experienceLevel: ExperienceLevel;
    salaryMin: number;
    salaryMax: number;
    benefits: string;
    vacancy: number;
    skills: string[];
    categoryIndex: number;
    subCategoryIndex: number;
}>> = {
    0: [ // TechNova Solutions
        {
            title: "Senior Full-Stack Engineer",
            description: "Join our core product team to build scalable web applications used by thousands of businesses. You'll work across the entire stack — from React frontends to Node.js microservices — and influence architectural decisions.",
            responsibilities: "- Design and implement new features end-to-end\n- Review code and mentor junior developers\n- Collaborate with product and design teams\n- Participate in on-call rotation",
            requirements: "- 4+ years of full-stack development experience\n- Strong proficiency in React, Node.js, TypeScript\n- Experience with PostgreSQL and Redis\n- Understanding of CI/CD pipelines",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 80000, salaryMax: 120000, vacancy: 2,
            benefits: "Health insurance, annual bonus, remote Fridays, learning budget BDT 30,000/year",
            skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
            categoryIndex: 0, subCategoryIndex: 1,
        },
        {
            title: "DevOps Engineer",
            description: "Own our cloud infrastructure on AWS. You'll automate deployments, monitor system health, and ensure 99.9% uptime for our SaaS products.",
            responsibilities: "- Manage AWS infrastructure using Terraform\n- Build and maintain CI/CD pipelines\n- Monitor systems with CloudWatch and Datadog\n- Conduct capacity planning",
            requirements: "- 3+ years in DevOps or SRE roles\n- AWS certification preferred\n- Strong Kubernetes and Docker knowledge\n- Scripting skills in Bash or Python",
            type: JobType.FULL_TIME, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 60000, salaryMax: 90000, vacancy: 1,
            benefits: "Fully remote, AWS certification sponsored, flexible hours",
            skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Python"],
            categoryIndex: 0, subCategoryIndex: 2,
        },
        {
            title: "Frontend Developer (React)",
            description: "Build beautiful, performant user interfaces for our enterprise dashboard. You care deeply about UX and write clean, tested code.",
            responsibilities: "- Build responsive UI components in React\n- Collaborate with designers in Figma\n- Write unit and integration tests\n- Optimise for performance and accessibility",
            requirements: "- 2+ years React experience\n- Proficient in TypeScript and TailwindCSS\n- Familiarity with REST and GraphQL APIs\n- Eye for design detail",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 50000, salaryMax: 75000, vacancy: 3,
            benefits: "MacBook Pro, flexible hours, team lunches",
            skills: ["React", "TypeScript", "TailwindCSS", "GraphQL", "Figma"],
            categoryIndex: 0, subCategoryIndex: 0,
        },
        {
            title: "Data Engineer",
            description: "Design and maintain our data pipelines that process millions of events daily, powering analytics and ML models.",
            responsibilities: "- Build ETL pipelines using Python and Airflow\n- Manage data warehouse on BigQuery\n- Ensure data quality and governance\n- Work closely with data scientists",
            requirements: "- 3+ years data engineering experience\n- Proficient in Python and SQL\n- Experience with cloud data warehouses\n- Understanding of streaming data (Kafka preferred)",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 65000, salaryMax: 95000, vacancy: 1,
            benefits: "GCP credits, conference budget, remote work 3 days/week",
            skills: ["Python", "SQL", "Data Analysis", "GCP", "PostgreSQL"],
            categoryIndex: 0, subCategoryIndex: 4,
        },
        {
            title: "Junior Backend Developer",
            description: "A great entry point for developers looking to grow in a supportive environment. You'll work on real features with mentorship from senior engineers.",
            responsibilities: "- Develop REST API endpoints in Node.js\n- Write unit tests for your code\n- Participate in code reviews\n- Document your work",
            requirements: "- 1+ year experience in backend development\n- Basic knowledge of Node.js or Python\n- Familiarity with databases (SQL or NoSQL)\n- Eagerness to learn",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.ENTRY,
            salaryMin: 30000, salaryMax: 45000, vacancy: 2,
            benefits: "Mentorship programme, training courses, team events",
            skills: ["Node.js", "REST API", "PostgreSQL", "Agile"],
            categoryIndex: 0, subCategoryIndex: 1,
        },
    ],
    1: [ // GreenBridge Finance
        {
            title: "Senior Financial Analyst",
            description: "Lead financial modelling and analysis to support strategic decisions for our SME lending portfolio across Bangladesh.",
            responsibilities: "- Build and maintain financial models\n- Prepare monthly management reports\n- Conduct portfolio risk analysis\n- Present insights to senior leadership",
            requirements: "- 5+ years in financial analysis\n- Advanced Excel and financial modelling skills\n- CFA or CA preferred\n- Strong analytical and communication skills",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 90000, salaryMax: 130000, vacancy: 1,
            benefits: "Provident fund, annual bonus, health coverage, professional development",
            skills: ["Financial Modelling", "Excel", "SQL", "Data Analysis"],
            categoryIndex: 2, subCategoryIndex: 2,
        },
        {
            title: "Credit Risk Analyst",
            description: "Evaluate SME loan applications and develop credit scoring models to maintain a healthy lending portfolio.",
            responsibilities: "- Review and analyse loan applications\n- Develop and improve credit scoring models\n- Monitor portfolio credit quality\n- Prepare risk reports",
            requirements: "- 3+ years in credit risk or lending\n- Strong quantitative skills\n- Knowledge of Bangladesh banking regulations\n- SQL proficiency",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 60000, salaryMax: 85000, vacancy: 2,
            benefits: "Medical coverage, quarterly performance bonus",
            skills: ["Financial Modelling", "SQL", "Data Analysis", "Excel"],
            categoryIndex: 2, subCategoryIndex: 2,
        },
        {
            title: "Finance Product Manager",
            description: "Own our digital lending product roadmap and work with engineering, design, and compliance to ship features customers love.",
            responsibilities: "- Define product vision for digital lending features\n- Write detailed product specs and user stories\n- Work closely with engineering and UX teams\n- Analyse product metrics and user feedback",
            requirements: "- 4+ years in product management, preferably fintech\n- Strong understanding of financial products\n- Excellent stakeholder management\n- Data-driven decision making",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 100000, salaryMax: 140000, vacancy: 1,
            benefits: "Equity options, flexible hours, health insurance",
            skills: ["Project Management", "Agile", "Communication", "Data Analysis"],
            categoryIndex: 2, subCategoryIndex: 1,
        },
        {
            title: "Accountant",
            description: "Manage day-to-day accounting operations and ensure compliance with local financial regulations.",
            responsibilities: "- Maintain accurate general ledger\n- Process accounts payable/receivable\n- Prepare monthly reconciliations\n- Assist with annual audits",
            requirements: "- Degree in Accounting or Finance\n- 2+ years accounting experience\n- Knowledge of local tax laws\n- Proficient in accounting software",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 35000, salaryMax: 55000, vacancy: 2,
            benefits: "Provident fund, medical coverage",
            skills: ["Accounting", "Excel", "Financial Modelling"],
            categoryIndex: 2, subCategoryIndex: 0,
        },
        {
            title: "Data Analyst – Finance",
            description: "Turn complex financial data into clear insights that drive product and business decisions.",
            responsibilities: "- Extract and analyse financial datasets\n- Build dashboards and automated reports\n- Support business teams with ad-hoc analysis\n- Ensure data accuracy and consistency",
            requirements: "- 2+ years in data or financial analysis\n- Strong SQL skills\n- Experience with BI tools (Power BI, Tableau, or Metabase)\n- Python is a plus",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 50000, salaryMax: 70000, vacancy: 1,
            benefits: "Flexible hours, training budget, health card",
            skills: ["SQL", "Data Analysis", "Excel", "Python"],
            categoryIndex: 2, subCategoryIndex: 2,
        },
    ],
    2: [ // PixelCraft Agency
        {
            title: "Senior UI/UX Designer",
            description: "Lead design for client projects from discovery to delivery. You'll run workshops, create wireframes, prototypes, and polished UI — all grounded in user research.",
            responsibilities: "- Lead end-to-end UX process for 2-3 client projects simultaneously\n- Conduct user research and usability testing\n- Create wireframes, prototypes, and high-fidelity designs\n- Present and articulate design decisions to clients",
            requirements: "- 4+ years UI/UX design experience\n- Expert in Figma\n- Strong portfolio showing web and mobile projects\n- Experience facilitating design thinking workshops",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 70000, salaryMax: 100000, vacancy: 1,
            benefits: "MacBook Pro, creative retreat, Figma & Adobe licenses",
            skills: ["Figma", "Adobe XD", "UI/UX Design", "Communication"],
            categoryIndex: 1, subCategoryIndex: 0,
        },
        {
            title: "Graphic Designer",
            description: "Create compelling visual identities, marketing materials, and digital assets for a diverse portfolio of clients.",
            responsibilities: "- Design brand identities (logo, typography, colour systems)\n- Produce social media and digital marketing assets\n- Create print-ready materials\n- Collaborate with copywriters and account managers",
            requirements: "- 2+ years graphic design experience\n- Proficiency in Adobe Illustrator, Photoshop, InDesign\n- Strong typography skills\n- Portfolio demonstrating versatility",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 40000, salaryMax: 60000, vacancy: 2,
            benefits: "Adobe Creative Cloud, quarterly team outing, flexible Fridays",
            skills: ["Figma", "Adobe XD", "Content Writing"],
            categoryIndex: 1, subCategoryIndex: 1,
        },
        {
            title: "Video Editor & Motion Designer",
            description: "Bring stories to life through video editing and motion graphics for brand campaigns, social media, and product demos.",
            responsibilities: "- Edit video content for various formats and platforms\n- Create motion graphics and animations\n- Manage post-production workflow\n- Ensure brand consistency across outputs",
            requirements: "- 2+ years video editing experience\n- Proficiency in Adobe Premiere Pro and After Effects\n- Motion graphics portfolio required\n- Ability to work under tight deadlines",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 45000, salaryMax: 65000, vacancy: 1,
            benefits: "High-end workstation, Adobe CC, annual bonus",
            skills: ["Adobe XD", "Content Writing", "Communication"],
            categoryIndex: 1, subCategoryIndex: 2,
        },
        {
            title: "Junior UI Designer",
            description: "An exciting opportunity for a talented junior designer to grow their skills on real client projects with mentorship from senior designers.",
            responsibilities: "- Assist with wireframing and UI design tasks\n- Prepare assets for handoff to developers\n- Contribute to design system maintenance\n- Participate in client review meetings",
            requirements: "- Portfolio showing UI design work (personal or academic projects welcome)\n- Basic Figma proficiency\n- Passion for great design\n- Willingness to learn and take feedback",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.ENTRY,
            salaryMin: 25000, salaryMax: 38000, vacancy: 2,
            benefits: "Mentorship, Figma license, design courses sponsored",
            skills: ["Figma", "Adobe XD"],
            categoryIndex: 1, subCategoryIndex: 0,
        },
        {
            title: "Digital Marketing Specialist",
            description: "Plan and execute digital marketing campaigns for our agency clients across social, search, and email channels.",
            responsibilities: "- Plan and run paid social and search campaigns\n- Manage client social media accounts\n- Track and report campaign performance\n- Collaborate with designers on creative assets",
            requirements: "- 2+ years digital marketing experience\n- Hands-on with Google Ads and Meta Ads\n- Strong analytical skills\n- Excellent written communication",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 40000, salaryMax: 60000, vacancy: 1,
            benefits: "Certification budget, flexible hours, performance bonus",
            skills: ["Google Ads", "SEO", "Social Media Marketing", "Content Writing"],
            categoryIndex: 6, subCategoryIndex: 0,
        },
    ],
    3: [ // MediPath Healthcare
        {
            title: "Health IT Project Manager",
            description: "Lead implementation of our Electronic Medical Record system across 50+ partner clinics, ensuring smooth rollouts and adoption.",
            responsibilities: "- Manage EMR rollout projects end-to-end\n- Coordinate with clinical and technical teams\n- Train clinic staff on new systems\n- Track project milestones and report to leadership",
            requirements: "- 5+ years project management experience\n- Background in healthcare IT preferred\n- PMP certification is a plus\n- Strong stakeholder management skills",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 85000, salaryMax: 115000, vacancy: 1,
            benefits: "Health coverage, life insurance, annual bonus, childcare allowance",
            skills: ["Project Management", "Agile", "Communication", "EMR Systems"],
            categoryIndex: 3, subCategoryIndex: 1,
        },
        {
            title: "Medical Coder",
            description: "Ensure accurate medical coding for insurance claims and reimbursements across our network of partner clinics.",
            responsibilities: "- Review medical records and assign appropriate ICD/CPT codes\n- Ensure coding compliance with payer requirements\n- Resolve coding queries from billing team\n- Keep up with coding guideline updates",
            requirements: "- CPC or CCS certification required\n- 2+ years medical coding experience\n- Knowledge of ICD-10 and CPT coding\n- Attention to detail",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 40000, salaryMax: 60000, vacancy: 3,
            benefits: "Medical benefits, annual increment, training support",
            skills: ["Medical Coding", "Healthcare Administration", "EMR Systems"],
            categoryIndex: 3, subCategoryIndex: 0,
        },
        {
            title: "Healthcare Data Analyst",
            description: "Analyse clinical and operational data to improve patient outcomes and operational efficiency across our partner network.",
            responsibilities: "- Collect and analyse clinical datasets\n- Build dashboards for hospital leadership\n- Identify trends in patient outcomes\n- Support research initiatives",
            requirements: "- 3+ years data analysis experience\n- Healthcare domain knowledge preferred\n- Proficient in SQL and Excel\n- Experience with BI tools",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 55000, salaryMax: 80000, vacancy: 1,
            benefits: "Health insurance, flexible hours, annual conference budget",
            skills: ["Data Analysis", "SQL", "Excel", "Healthcare Administration"],
            categoryIndex: 3, subCategoryIndex: 1,
        },
        {
            title: "Hospital Administrator",
            description: "Oversee daily operations of our partner clinic in Sylhet, ensuring smooth patient flow and staff coordination.",
            responsibilities: "- Manage clinic day-to-day operations\n- Coordinate between medical and support staff\n- Handle patient complaints and feedback\n- Prepare operational reports",
            requirements: "- Degree in Healthcare Management or related field\n- 3+ years healthcare administration experience\n- Strong leadership and communication skills\n- Based in or willing to relocate to Sylhet",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 50000, salaryMax: 75000, vacancy: 2,
            benefits: "Accommodation support, health coverage, annual bonus",
            skills: ["Healthcare Administration", "Communication", "Project Management"],
            categoryIndex: 3, subCategoryIndex: 2,
        },
        {
            title: "Software Developer – Health IT",
            description: "Build and maintain our patient management platform and integrations with third-party healthcare systems.",
            responsibilities: "- Develop features for our patient management platform\n- Build HL7/FHIR integrations\n- Ensure system security and data privacy compliance\n- Write technical documentation",
            requirements: "- 3+ years software development experience\n- Experience with healthcare APIs (HL7, FHIR) preferred\n- Proficient in Python or Node.js\n- Understanding of healthcare data regulations",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 60000, salaryMax: 90000, vacancy: 1,
            benefits: "Health coverage, remote work 2 days/week, training budget",
            skills: ["Python", "Node.js", "REST API", "PostgreSQL"],
            categoryIndex: 3, subCategoryIndex: 1,
        },
    ],
    4: [ // EduRocket
        {
            title: "Curriculum Designer – Technology",
            description: "Design engaging, practical online courses in software development and data science for our 2M+ learner base.",
            responsibilities: "- Design course curriculum and learning outcomes\n- Create instructional materials and assessments\n- Collaborate with subject matter experts\n- Analyse learner feedback to improve content",
            requirements: "- 3+ years curriculum design or instructional design experience\n- Background in technology education\n- Familiarity with LMS platforms (Moodle, Canvas, or similar)\n- Strong writing skills",
            type: JobType.FULL_TIME, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 50000, salaryMax: 72000, vacancy: 2,
            benefits: "Fully remote, free access to all courses, learning budget",
            skills: ["Curriculum Design", "LMS Platforms", "Content Writing", "Communication"],
            categoryIndex: 4, subCategoryIndex: 1,
        },
        {
            title: "Online Teacher – Mathematics",
            description: "Deliver live and recorded mathematics lessons for secondary and higher-secondary students on our platform.",
            responsibilities: "- Teach live online classes (10-15 hrs/week)\n- Record course modules for on-demand learning\n- Create assignments and assessments\n- Engage with students via the community forum",
            requirements: "- Bachelor's or Master's degree in Mathematics or related field\n- 2+ years teaching experience\n- Comfortable with video-based teaching\n- Strong communication skills in Bangla and English",
            type: JobType.PART_TIME, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 20000, salaryMax: 40000, vacancy: 5,
            benefits: "Flexible schedule, royalty from course sales, free courses",
            skills: ["Communication", "Curriculum Design", "LMS Platforms"],
            categoryIndex: 4, subCategoryIndex: 0,
        },
        {
            title: "EdTech Product Manager",
            description: "Define the product roadmap for our mobile learning app used by 500,000+ students monthly.",
            responsibilities: "- Own product roadmap for the EduRocket mobile app\n- Conduct user research and define requirements\n- Work with engineering and design teams\n- Analyse engagement and learning outcome metrics",
            requirements: "- 4+ years product management experience\n- Experience in EdTech or consumer apps\n- Strong data-driven mindset\n- Excellent communication skills",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 90000, salaryMax: 125000, vacancy: 1,
            benefits: "Equity options, flexible hours, all courses free",
            skills: ["Project Management", "Agile", "Data Analysis", "Communication"],
            categoryIndex: 4, subCategoryIndex: 2,
        },
        {
            title: "Content Writer – Education",
            description: "Write clear, engaging educational content for courses, blogs, and marketing materials across multiple subjects.",
            responsibilities: "- Write course content and learning materials\n- Create blog posts and educational articles\n- Collaborate with teachers and subject experts\n- Edit and proofread content for accuracy and clarity",
            requirements: "- Excellent writing skills in English and Bangla\n- Background in education or journalism preferred\n- Ability to simplify complex topics\n- SEO knowledge is a plus",
            type: JobType.FULL_TIME, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.ENTRY,
            salaryMin: 25000, salaryMax: 38000, vacancy: 3,
            benefits: "Fully remote, flexible hours, free course access",
            skills: ["Content Writing", "SEO", "Communication"],
            categoryIndex: 4, subCategoryIndex: 0,
        },
        {
            title: "Mobile App Developer (React Native)",
            description: "Build and improve our React Native mobile app that delivers live classes and recorded content to learners across Bangladesh.",
            responsibilities: "- Develop new features for the EduRocket mobile app\n- Optimise app performance and reduce load times\n- Integrate with backend APIs\n- Fix bugs and improve app stability",
            requirements: "- 2+ years React Native development experience\n- Strong JavaScript/TypeScript skills\n- Experience with App Store and Google Play deployment\n- Passion for education technology",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 55000, salaryMax: 80000, vacancy: 2,
            benefits: "Free courses, equity options, MacBook provided",
            skills: ["React", "TypeScript", "REST API", "Mobile Development"],
            categoryIndex: 0, subCategoryIndex: 3,
        },
    ],
    5: [ // LogiFlow Logistics
        {
            title: "Supply Chain Analyst",
            description: "Optimise our last-mile delivery network by analysing route efficiency, vendor performance, and inventory levels.",
            responsibilities: "- Analyse delivery data to identify bottlenecks\n- Model supply chain scenarios\n- Track vendor KPIs and SLAs\n- Report insights to operations leadership",
            requirements: "- 2+ years supply chain or logistics analysis experience\n- Strong Excel and data skills\n- SQL knowledge preferred\n- Degree in Supply Chain, Business, or related field",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 40000, salaryMax: 60000, vacancy: 2,
            benefits: "Transport allowance, health card, annual bonus",
            skills: ["Logistics Planning", "Data Analysis", "SQL", "Excel"],
            categoryIndex: 5, subCategoryIndex: 0,
        },
        {
            title: "Warehouse Operations Manager",
            description: "Lead operations at our Narayanganj fulfilment centre, managing a team of 50+ staff and ensuring daily dispatch targets are met.",
            responsibilities: "- Oversee daily warehouse operations\n- Manage and develop warehouse staff\n- Ensure inventory accuracy and order fulfilment targets\n- Implement safety and process improvements",
            requirements: "- 5+ years warehouse or operations management experience\n- Strong leadership skills\n- Familiarity with WMS software\n- Based in or willing to relocate to Narayanganj",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 70000, salaryMax: 100000, vacancy: 1,
            benefits: "Transport allowance, health insurance, annual bonus, housing support",
            skills: ["Logistics Planning", "Project Management", "Communication"],
            categoryIndex: 5, subCategoryIndex: 1,
        },
        {
            title: "Fleet Manager",
            description: "Manage our fleet of 200+ delivery vehicles, ensuring optimal utilisation, maintenance scheduling, and driver management.",
            responsibilities: "- Oversee vehicle maintenance schedules\n- Manage driver roster and performance\n- Track fuel consumption and costs\n- Liaise with insurance and regulatory bodies",
            requirements: "- 4+ years fleet management experience\n- Knowledge of Bangladesh vehicle regulations\n- Strong organisational skills\n- Experience with fleet management software",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 55000, salaryMax: 80000, vacancy: 1,
            benefits: "Company vehicle, health card, performance bonus",
            skills: ["Logistics Planning", "Project Management", "Communication"],
            categoryIndex: 5, subCategoryIndex: 2,
        },
        {
            title: "Logistics Software Engineer",
            description: "Build the routing algorithms and tracking systems that power our last-mile delivery operations.",
            responsibilities: "- Develop and improve route optimisation algorithms\n- Build real-time tracking integrations\n- Maintain the internal logistics management platform\n- Collaborate with operations team on feature requirements",
            requirements: "- 3+ years software development experience\n- Strong algorithms and data structures knowledge\n- Proficient in Python or Node.js\n- Experience with mapping APIs (Google Maps, HERE)",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 60000, salaryMax: 90000, vacancy: 2,
            benefits: "Flexible hours, transport allowance, annual bonus",
            skills: ["Python", "Node.js", "REST API", "PostgreSQL"],
            categoryIndex: 0, subCategoryIndex: 1,
        },
        {
            title: "Operations Coordinator",
            description: "Coordinate between warehouse, fleet, and customer service teams to ensure smooth daily delivery operations.",
            responsibilities: "- Track daily delivery progress and resolve issues\n- Communicate with drivers and warehouse staff\n- Update customers on delivery status\n- Maintain operational logs and reports",
            requirements: "- 1+ year experience in operations or coordination role\n- Strong communication skills\n- Ability to work in a fast-paced environment\n- Proficient in MS Office",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.ENTRY,
            salaryMin: 22000, salaryMax: 35000, vacancy: 4,
            benefits: "Transport allowance, annual increment, health card",
            skills: ["Communication", "Logistics Planning", "Excel"],
            categoryIndex: 5, subCategoryIndex: 0,
        },
    ],
    6: [ // CloudBase Systems
        {
            title: "Cloud Infrastructure Engineer",
            description: "Design and manage multi-cloud environments for our startup clients, helping them scale reliably and cost-effectively.",
            responsibilities: "- Design cloud architecture on AWS and GCP\n- Implement infrastructure as code with Terraform\n- Set up monitoring, alerting, and observability stacks\n- Provide technical guidance to client engineering teams",
            requirements: "- 4+ years cloud engineering experience\n- AWS Solutions Architect or GCP Professional certification\n- Expert in Terraform and Kubernetes\n- Strong security mindset",
            type: JobType.FULL_TIME, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 100000, salaryMax: 140000, vacancy: 2,
            benefits: "Fully remote, AWS+GCP cert sponsored, equity options, flexible hours",
            skills: ["AWS", "GCP", "Docker", "Kubernetes", "DevOps"],
            categoryIndex: 0, subCategoryIndex: 2,
        },
        {
            title: "DevOps Consultant",
            description: "Work with early-stage startups to set up their DevOps culture, CI/CD pipelines, and cloud infrastructure from scratch.",
            responsibilities: "- Assess client infrastructure and recommend improvements\n- Implement CI/CD pipelines (GitHub Actions, GitLab CI)\n- Set up containerisation with Docker and Kubernetes\n- Train client development teams",
            requirements: "- 3+ years DevOps experience\n- Consulting or client-facing experience preferred\n- Strong Linux and networking fundamentals\n- Excellent communication skills",
            type: JobType.CONTRACT, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 80000, salaryMax: 110000, vacancy: 3,
            benefits: "Remote, flexible schedule, cert budget, project bonuses",
            skills: ["CI/CD", "Docker", "Kubernetes", "AWS", "DevOps"],
            categoryIndex: 0, subCategoryIndex: 2,
        },
        {
            title: "Site Reliability Engineer (SRE)",
            description: "Own reliability, performance, and scalability of our internal SaaS platform and help clients achieve their SLOs.",
            responsibilities: "- Define and track SLIs, SLOs, and error budgets\n- Build runbooks and incident response playbooks\n- Lead post-incident reviews\n- Automate toil and improve system reliability",
            requirements: "- 3+ years SRE or platform engineering experience\n- Strong Python or Go scripting skills\n- Experience with observability tools (Prometheus, Grafana, Datadog)\n- Solid understanding of distributed systems",
            type: JobType.FULL_TIME, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 85000, salaryMax: 120000, vacancy: 1,
            benefits: "Remote-first, stock options, on-call premium, cert budget",
            skills: ["Python", "Docker", "Kubernetes", "CI/CD", "AWS"],
            categoryIndex: 0, subCategoryIndex: 2,
        },
        {
            title: "Backend Engineer (Go / Python)",
            description: "Build the APIs and microservices that power our cloud management platform, handling thousands of infrastructure events per second.",
            responsibilities: "- Develop microservices in Go or Python\n- Design scalable APIs for our management platform\n- Optimise for high throughput and low latency\n- Write comprehensive tests",
            requirements: "- 3+ years backend development experience\n- Proficiency in Go or Python\n- Experience with message queues (RabbitMQ, Kafka)\n- Familiarity with cloud provider APIs",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 75000, salaryMax: 105000, vacancy: 2,
            benefits: "Hybrid work, MacBook, stock options, AWS cert sponsored",
            skills: ["Python", "Docker", "REST API", "PostgreSQL", "CI/CD"],
            categoryIndex: 0, subCategoryIndex: 1,
        },
        {
            title: "Technical Writer – Cloud & DevOps",
            description: "Create clear, developer-friendly documentation for our cloud platform, CLI tools, and API references.",
            responsibilities: "- Write and maintain technical documentation\n- Create tutorials and getting-started guides\n- Work with engineers to document new features\n- Gather feedback from developers and improve docs",
            requirements: "- 2+ years technical writing experience\n- Ability to understand and explain complex technical concepts\n- Familiarity with cloud and DevOps concepts\n- Experience with docs-as-code (Markdown, Git)",
            type: JobType.FULL_TIME, locationType: LocationType.REMOTE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 45000, salaryMax: 65000, vacancy: 1,
            benefits: "Fully remote, flexible hours, learning budget",
            skills: ["Content Writing", "Communication", "AWS", "DevOps"],
            categoryIndex: 0, subCategoryIndex: 2,
        },
    ],
    7: [ // RetailX
        {
            title: "E-Commerce Growth Manager",
            description: "Lead growth initiatives to acquire new merchant partners and scale GMV on our B2B marketplace.",
            responsibilities: "- Define and execute merchant acquisition strategy\n- Run A/B tests on growth loops\n- Analyse funnel data and identify growth levers\n- Collaborate with product and marketing teams",
            requirements: "- 4+ years in growth, marketing, or business development\n- E-commerce domain experience preferred\n- Strong analytical skills and comfort with data\n- Excellent communication and negotiation skills",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 90000, salaryMax: 120000, vacancy: 1,
            benefits: "Performance bonus, health insurance, gym access",
            skills: ["SEO", "Google Ads", "Social Media Marketing", "Data Analysis"],
            categoryIndex: 6, subCategoryIndex: 1,
        },
        {
            title: "Sales Executive – B2B",
            description: "Onboard new retail merchants to the RetailX platform and help them grow their online business.",
            responsibilities: "- Prospect and qualify potential merchant partners\n- Conduct demos and close deals\n- Onboard new merchants and support their first sales\n- Maintain CRM records and pipeline reports",
            requirements: "- 2+ years B2B sales experience\n- Strong persuasion and communication skills\n- Results-driven mindset\n- Experience in e-commerce or retail is a plus",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.MID,
            salaryMin: 35000, salaryMax: 60000, vacancy: 5,
            benefits: "Commission structure, health card, monthly incentives",
            skills: ["Communication", "Sales", "Social Media Marketing"],
            categoryIndex: 6, subCategoryIndex: 1,
        },
        {
            title: "Full-Stack Engineer – Marketplace",
            description: "Build new features for our marketplace platform connecting thousands of merchants and buyers across Bangladesh.",
            responsibilities: "- Develop full-stack features in React and Node.js\n- Integrate payment gateways and logistics APIs\n- Ensure platform performance and reliability\n- Participate in architecture discussions",
            requirements: "- 3+ years full-stack development experience\n- Proficient in React, Node.js, and TypeScript\n- Experience with e-commerce platforms a plus\n- PostgreSQL or MongoDB experience",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.MID,
            salaryMin: 65000, salaryMax: 95000, vacancy: 3,
            benefits: "Staff discounts, flexible hours, performance bonus",
            skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST API"],
            categoryIndex: 0, subCategoryIndex: 1,
        },
        {
            title: "Digital Marketing Manager",
            description: "Own all digital marketing channels for RetailX, driving merchant acquisition and brand awareness across Bangladesh.",
            responsibilities: "- Plan and execute digital campaigns across Google, Meta, and LinkedIn\n- Manage content calendar and social media channels\n- Measure and optimise campaign ROI\n- Work with creative team on ad assets",
            requirements: "- 4+ years digital marketing experience\n- Proven track record in paid acquisition\n- Strong analytical skills\n- E-commerce experience preferred",
            type: JobType.FULL_TIME, locationType: LocationType.HYBRID, experienceLevel: ExperienceLevel.SENIOR,
            salaryMin: 75000, salaryMax: 105000, vacancy: 1,
            benefits: "Performance bonus, health insurance, flexible hours",
            skills: ["Google Ads", "SEO", "Social Media Marketing", "Content Writing"],
            categoryIndex: 6, subCategoryIndex: 0,
        },
        {
            title: "Customer Success Executive",
            description: "Ensure our merchant partners get maximum value from the RetailX platform through proactive support and guidance.",
            responsibilities: "- Onboard new merchants and provide training\n- Resolve merchant queries and escalations\n- Monitor merchant health metrics\n- Gather feedback to inform product improvements",
            requirements: "- 1+ year customer success or support experience\n- Strong communication skills in Bangla and English\n- Patient and solution-oriented mindset\n- Familiarity with e-commerce basics",
            type: JobType.FULL_TIME, locationType: LocationType.ONSITE, experienceLevel: ExperienceLevel.ENTRY,
            salaryMin: 22000, salaryMax: 35000, vacancy: 4,
            benefits: "Staff discounts, health card, annual increment",
            skills: ["Communication", "Sales"],
            categoryIndex: 6, subCategoryIndex: 1,
        },
    ],
};

// ─────────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────────
async function main() {
    console.log("🌱 Starting JobSpark seed...\n");

    // 1. WorkStyles
    console.log("📐 Seeding WorkStyles...");
    const workStyles = await Promise.all(
        WORK_STYLES.map((ws) =>
            prisma.workStyle.upsert({
                where: { value: ws.value },
                update: {},
                create: ws,
            })
        )
    );
    console.log(`   ✅ ${workStyles.length} WorkStyles ready`);

    // 2. Skills
    console.log("🛠  Seeding Skills...");
    const skillMap: Record<string, string> = {};
    for (const name of SKILLS_LIST) {
        const skill = await prisma.skill.upsert({
            where: { name },
            update: {},
            create: { name },
        });
        skillMap[name] = skill.id;
    }
    console.log(`   ✅ ${Object.keys(skillMap).length} Skills ready`);

    // 3. Categories & SubCategories
    console.log("🗂  Seeding Categories...");
    const categoryIds: string[] = [];
    const subCategoryMap: Record<string, string[]> = {};

    for (const cat of CATEGORIES_DATA) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon,
                color: cat.color,
                isActive: true,
                sortOrder: CATEGORIES_DATA.indexOf(cat),
            },
        });
        categoryIds.push(category.id);
        subCategoryMap[category.id] = [];

        for (const sub of cat.subcategories) {
            const subCat = await prisma.subCategory.upsert({
                where: { slug: sub.slug },
                update: {},
                create: {
                    name: sub.name,
                    slug: sub.slug,
                    categoryId: category.id,
                    sortOrder: cat.subcategories.indexOf(sub),
                },
            });
            subCategoryMap[category.id].push(subCat.id);
        }
    }
    console.log(`   ✅ ${CATEGORIES_DATA.length} Categories + subcategories ready`);

    // 4. Companies
    console.log("🏢 Seeding Companies...");
    const companyIds: string[] = [];
    for (const co of COMPANIES) {
        const company = await prisma.company.upsert({
            where: { id: co.name.replace(/\s+/g, "-").toLowerCase() },
            update: {},
            create: {
                id: co.name.replace(/\s+/g, "-").toLowerCase(),
                ...co,
            },
        });
        companyIds.push(company.id);
    }
    console.log(`   ✅ ${companyIds.length} Companies ready`);

    // 5. Recruiter Users + RecruiterProfiles
    console.log("👤 Seeding Recruiter Users & Profiles...");
    const recruiterProfileIds: string[] = [];

    for (let i = 0; i < RECRUITERS.length; i++) {
        const rec = RECRUITERS[i];
        const email = `recruiter${i + 1}@jobspark.dev`;

        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                name: rec.name,
                email,
                password: PASSWORD_HASH,
                role: UserRole.RECRUITER,
                emailVerified: true,
                status: "ACTIVE",
            },
        });

        const profile = await prisma.recruiterProfile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                companyId: companyIds[i],
                name: rec.name,
                position: rec.position,
                bio: rec.bio,
                phoneNumber: rec.phone,
            },
        });

        recruiterProfileIds.push(profile.id);
        console.log(`   👤 ${rec.name} → ${COMPANIES[i].name}`);
    }
    console.log(`   ✅ ${recruiterProfileIds.length} Recruiter profiles created`);

    // 6. Jobs
    console.log("\n💼 Seeding Jobs...");
    let totalJobs = 0;

    for (let companyIdx = 0; companyIdx < COMPANIES.length; companyIdx++) {
        const templates = JOB_TEMPLATES[companyIdx];
        const recruiterId = recruiterProfileIds[companyIdx];
        const companyId = companyIds[companyIdx];

        for (const tmpl of templates) {
            const catId = categoryIds[tmpl.categoryIndex];
            const subCatIds = subCategoryMap[catId] ?? [];
            const subCatId = subCatIds[tmpl.subCategoryIndex] ?? subCatIds[0];

            const job = await prisma.job.create({
                data: {
                    title: tmpl.title,
                    description: tmpl.description,
                    responsibilities: tmpl.responsibilities,
                    requirements: tmpl.requirements,
                    status: JobStatus.ACTIVE,
                    type: tmpl.type,
                    locationType: tmpl.locationType,
                    experienceLevel: tmpl.experienceLevel,
                    salaryMin: tmpl.salaryMin,
                    salaryMax: tmpl.salaryMax,
                    benefits: tmpl.benefits,
                    vacancy: tmpl.vacancy,
                    location: COMPANIES[companyIdx].location,
                    companyId,
                    recruiterId,
                    categoryId: catId,
                    subCategoryId: subCatId,
                    workStyleId: workStyles[randomInt(0, workStyles.length - 1)].id,
                    applicationDeadline: futureDate(randomInt(30, 90)),
                    viewCount: randomInt(50, 800),
                    applicationCount: randomInt(5, 60),
                },
            });

            // Attach skills
            for (const skillName of tmpl.skills) {
                if (skillMap[skillName]) {
                    await prisma.jobSkill.upsert({
                        where: { jobId_skillId: { jobId: job.id, skillId: skillMap[skillName] } },
                        update: {},
                        create: {
                            jobId: job.id,
                            skillId: skillMap[skillName],
                            isRequired: true,
                        },
                    });
                }
            }

            totalJobs++;
            console.log(`   ✅ [${COMPANIES[companyIdx].name}] ${tmpl.title}`);
        }
    }

    // ─── SUMMARY ───────────────────────────────
    console.log("\n" + "═".repeat(50));
    console.log("🎉 JobSpark seed complete!\n");
    console.log(`   🏢 Companies     : ${companyIds.length}`);
    console.log(`   👤 Recruiters    : ${recruiterProfileIds.length}`);
    console.log(`   💼 Jobs          : ${totalJobs}`);
    console.log(`   📂 Categories    : ${CATEGORIES_DATA.length}`);
    console.log(`   🛠  Skills        : ${Object.keys(skillMap).length}`);
    console.log("═".repeat(50));
    console.log("\n🔑 All recruiter passwords: Password123!");
    console.log("📧 Recruiter emails: recruiter1@jobspark.dev → recruiter8@jobspark.dev\n");
}

main()
    .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });