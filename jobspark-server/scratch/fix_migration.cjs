const { PrismaClient } = require('../prisma/generated/prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Removing old migration record...");
    await prisma.$executeRawUnsafe(`DELETE FROM "_prisma_migrations" WHERE migration_name = '20260512193700_status_update'`);
    console.log("Done.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
