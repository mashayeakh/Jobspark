const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.recruiterProfile.updateMany({
        data: {
            subscriptionStatus: 'NONE'
        }
    });
    console.log("Reset all recruiter subscription statuses to NONE.");
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
