import { prisma } from './src/app/lib/prisma';

async function main() {
  const pending = await prisma.connection.findMany();
  console.log('All connections:', pending);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
