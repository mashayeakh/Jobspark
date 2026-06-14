import { prisma } from "../lib/prisma";

const defaultStages = [
  { name: 'Applied', color: 'bg-blue-500', isDefault: true, order: 1 },
  { name: 'HR Review', color: 'bg-purple-500', isDefault: true, order: 2 },
  { name: 'HR Interview', color: 'bg-indigo-500', isDefault: false, order: 3 },
  { name: 'Offer Sent', color: 'bg-green-500', isDefault: false, order: 4 }
];

async function main() {
  console.log("Starting to seed pipeline stages for existing companies...");
  
  const companies = await prisma.company.findMany();
  let createdCount = 0;
  
  for (const company of companies) {
    // Wipe existing stages for all companies
    await prisma.pipelineStage.deleteMany({
      where: { companyId: company.id }
    });
    
    console.log(`Creating default stages for company: ${company.name}`);
      for (const stage of defaultStages) {
        await prisma.pipelineStage.create({
          data: {
            companyId: company.id,
            name: stage.name,
            color: stage.color,
            isDefault: stage.isDefault,
            order: stage.order
          }
        });
      }
      createdCount++;
  }
  
  console.log(`Seeding finished. Added stages to ${createdCount} companies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
