import { PrismaClient } from './prisma/generated/prisma/client.js';
import { envVars } from './src/app/config/env.js';
import { PrismaPg } from '@prisma/adapter-pg/index.js';
import pg from 'pg/index.js';

const pool = new pg.Pool({ connectionString: envVars.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testDatabase() {
  try {
    console.log("Testing database connection...");

    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Check existing jobs
    const jobCount = await prisma.job.count();
    console.log(`📊 Current job count: ${jobCount}`);

    if (jobCount > 0) {
      const jobs = await prisma.job.findMany({
        take: 3,
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true
        }
      });
      console.log("📋 Sample jobs:");
      jobs.forEach(job => {
        console.log(`  - ${job.title} (${job.id})`);
      });
    }

    // Test user count
    const userCount = await prisma.user.count();
    console.log(`👥 Current user count: ${userCount}`);

    // Test company count
    const companyCount = await prisma.company.count();
    console.log(`🏢 Current company count: ${companyCount}`);

  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    console.error("Full error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
