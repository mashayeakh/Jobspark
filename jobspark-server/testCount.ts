import { prisma } from './src/app/lib/prisma';

async function main() {
  const allCount = await prisma.job.count();
  const openCount = await prisma.job.count({
    where: { status: 'OPEN', deletedAt: null }
  });
  console.log('Total jobs:', allCount);
  console.log('Total OPEN jobs:', openCount);
  
  const statuses = await prisma.job.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });
  console.log('Job statuses:', statuses);
}
main().catch(console.error).finally(() => prisma.$disconnect());
