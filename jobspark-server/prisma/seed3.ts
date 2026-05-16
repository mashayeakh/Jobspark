import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import {
    PrismaClient,
    JobStatus,
    JobType,
    LocationType,
    ExperienceLevel,
} from "./generated/prisma/client";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SUSPICIOUS_JOB_SEEDS = [
    {
        title: "Urgent Remote Data Entry Clerk",
        companyId: "technova-solutions",
        status: JobStatus.ACTIVE,
        type: JobType.FULL_TIME,
        locationType: LocationType.REMOTE,
        experienceLevel: ExperienceLevel.ENTRY,
        salaryMin: 12000,
        salaryMax: 18000,
        location: "Dhaka, Bangladesh",
        responsibilities:
            "- Submit customer records and reports daily\n- Verify billing information and invoices\n- Transfer data into our secure portal\n- Share payment confirmation receipts with the hiring team",
        requirements:
            "- Must have a personal Gmail or Yahoo account\n- Able to pay a one-time registration fee of $49\n- Available to start immediately\n- Comfortable sharing bank details for transaction verification",
        description:
            "Immediate openings for a remote data entry position. Work from home, earn up to $750/week, and get started fast. This opportunity is urgent — positions fill up within hours. Please send your resume to hr.direct.jobs@gmail.com and complete the quick onboarding payment to reserve your place.",
        benefits: "Flexible hours, quick pay, unlimited vacation, remote work from anywhere",
        vacancy: 4,
    },
    {
        title: "High-Paying Recruitment Agent",
        companyId: "greenbridge-finance",
        status: JobStatus.ACTIVE,
        type: JobType.CONTRACT,
        locationType: LocationType.REMOTE,
        experienceLevel: ExperienceLevel.MID,
        salaryMin: 22000,
        salaryMax: 32000,
        location: "Chittagong, Bangladesh",
        responsibilities:
            "- Reach out to candidates via social media and email\n- Collect a small verification fee from applicants\n- Forward candidate details to the hiring manager\n- Manage multiple roles with little oversight",
        requirements:
            "- No experience required\n- Must provide a personal email address\n- Able to pay a refundable onboarding deposit\n- Available to start immediately",
        description:
            "Join our high-earning recruitment team and work remotely. We are always hiring for this fast-growing role. Send your profile to careers123@gmail.com and pay the onboarding deposit today — quick hires will be prioritized.",
        benefits: "High salary, remote work, flexible hours, quick money, unlimited vacation",
        vacancy: 3,
    },
    {
        title: "VIP Order Processing Specialist",
        companyId: "retailx",
        status: JobStatus.ACTIVE,
        type: JobType.FULL_TIME,
        locationType: LocationType.REMOTE,
        experienceLevel: ExperienceLevel.ENTRY,
        salaryMin: 14000,
        salaryMax: 20000,
        location: "Dhaka, Bangladesh",
        responsibilities:
            "- Process customer order documents quickly\n- Send proof of payment to clients\n- Share WhatsApp contact and personal email for faster communication\n- Keep order tracking sheets up to date",
        requirements:
            "- Must use a personal email address\n- Able to provide passport or ID on request\n- Fast learner with strong communication skills\n- Must pay a security fee to access the portal",
        description:
            "Become a VIP order processing specialist and earn instant payouts. This urgent role requires you to submit a small processing fee and share a copy of your passport or ID. Apply now through personal email at vip.orders.contact@gmail.com.",
        benefits: "Instant payouts, remote work, urgent hiring, personal email support",
        vacancy: 2,
    },
];

function addDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

async function findRecruiterId(companyId: string) {
    const recruiter = await prisma.recruiterProfile.findFirst({ where: { companyId } });
    if (!recruiter) {
        throw new Error(`Recruiter profile not found for companyId=${companyId}`);
    }
    return recruiter.id;
}

async function main() {
    console.log("🌱 Seeding suspicious job postings...");

    for (const jobSeed of SUSPICIOUS_JOB_SEEDS) {
        const recruiterId = await findRecruiterId(jobSeed.companyId);
        const existing = await prisma.job.findFirst({
            where: {
                title: jobSeed.title,
                companyId: jobSeed.companyId,
            },
        });

        const data = {
            ...jobSeed,
            recruiterId,
            applicationDeadline: addDays(45),
        };

        if (existing) {
            await prisma.job.update({
                where: { id: existing.id },
                data,
            });
            console.log(`✅ Updated suspicious job: ${jobSeed.title}`);
        } else {
            await prisma.job.create({ data });
            console.log(`✅ Created suspicious job: ${jobSeed.title}`);
        }
    }

    console.log("🎉 Suspicious seed complete!");
}

main()
    .catch((e) => {
        console.error("❌ Fraud seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
