import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../prisma/generated/prisma/client";

// Use the same configuration as the main app
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const requiredSkills = [
  'Symfony',
  'Next.js',
  'TypeScript',
  'Vue.js',
  'Angular',
  'React',
  'Node.js',
  'Python',
  'Docker',
  'AWS',
  'Azure'
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Seed skills
  for (const skillName of requiredSkills) {
    await prisma.skill.upsert({
      where: { name: skillName },
      update: {},
      create: { name: skillName }
    })
  }

  console.log('✅ Skills seeded successfully!')

  // Seed some default categories
  const categories = [
    { name: 'Engineering', slug: 'engineering', icon: 'code', color: '#3B82F6' },
    { name: 'Design', slug: 'design', icon: 'palette', color: '#EC4899' },
    { name: 'Marketing', slug: 'marketing', icon: 'megaphone', color: '#10B981' },
    { name: 'Sales', slug: 'sales', icon: 'briefcase', color: '#F59E0B' },
    { name: 'Product', slug: 'product', icon: 'lightbulb', color: '#8B5CF6' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('✅ Categories seeded successfully!')

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
