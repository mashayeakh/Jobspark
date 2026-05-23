import { prisma } from './src/app/lib/prisma';

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'JOB_SEEKER' }
  });
  console.log('JOB_SEEKER count:', users.length);
  
  const allUsers = await prisma.user.findMany();
  console.log('ALL Users count:', allUsers.length);
  console.log(allUsers.map(u => ({ email: u.email, role: u.role, isDeleted: u.isDeleted, status: u.status })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
