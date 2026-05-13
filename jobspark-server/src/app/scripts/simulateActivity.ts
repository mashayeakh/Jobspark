import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../lib/prisma';

async function main() {
    console.log('🚀 Simulating real-world activity...');

    // 1. Find all active jobs
    const activeJobs = await prisma.job.findMany({
        where: {
            status: { in: ['OPEN', 'ACTIVE'] as any },
            deletedAt: null
        }
    });

    if (activeJobs.length === 0) {
        console.log('❌ No active jobs found to simulate activity.');
        return;
    }

    // 2. Find some seekers (excluding recruiters)
    const seekers = await prisma.jobSeekerProfile.findMany({
        take: 10
    });

    if (seekers.length === 0) {
        console.log('❌ No seekers found to simulate applications.');
        return;
    }

    // 3. Add random applications and views
    for (const job of activeJobs) {
        // Boost views
        const viewsBoost = Math.floor(Math.random() * 100) + 20;
        await prisma.job.update({
            where: { id: job.id },
            data: { viewCount: { increment: viewsBoost } }
        });
        console.log(`📈 Boosted views for "${job.title}" by ${viewsBoost}`);

        // Add 1-3 random applications if not already applied
        const numApps = Math.floor(Math.random() * 3) + 1;
        const randomSeekers = seekers.sort(() => 0.5 - Math.random()).slice(0, numApps);

        for (const seeker of randomSeekers) {
            const existing = await prisma.application.findFirst({
                where: { jobId: job.id, seekerId: seeker.id }
            });

            if (!existing) {
                await prisma.application.create({
                    data: {
                        jobId: job.id,
                        seekerId: seeker.id,
                        status: 'PENDING',
                        appliedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random time in past
                    }
                });
                console.log(`📩 New application for "${job.title}" from Seeker ${seeker.id.slice(-4)}`);
            }
        }
    }

    console.log('✅ Activity simulation complete.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
