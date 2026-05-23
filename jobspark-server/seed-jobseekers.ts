import { UserRole, UserStatus } from './prisma/generated/prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from './src/app/lib/prisma';


async function main() {
  console.log("Seeding mock job seekers...");
  const password = await bcrypt.hash("Password123!", 10);

  const mockUsers = [
    {
      name: "Sarah Jenkins",
      email: "sarah@example.com",
      image: "https://i.pravatar.cc/150?u=sarah",
      headline: "Senior Frontend Engineer at TechCorp",
      bio: "Passionate about creating beautiful, accessible, and performant user interfaces. Experienced with React, TypeScript, and TailwindCSS. I love mentoring junior developers and contributing to open source.",
      company: "TechCorp"
    },
    {
      name: "David Kim",
      email: "david@example.com",
      image: "https://i.pravatar.cc/150?u=david",
      headline: "Engineering Manager at StartupX",
      bio: "Leading high-performing engineering teams and scaling infrastructure. 10+ years of experience in full-stack development and distributed systems.",
      company: "StartupX"
    },
    {
      name: "Emily Rodriguez",
      email: "emily@example.com",
      image: "https://i.pravatar.cc/150?u=emily",
      headline: "Full Stack Developer",
      bio: "Building full-stack applications with Node.js, Express, and React. Open source contributor.",
      company: "Freelance"
    },
    {
      name: "Michael Chen",
      email: "michael@example.com",
      image: "https://i.pravatar.cc/150?u=michael",
      headline: "UX/UI Designer",
      bio: "Designing intuitive and engaging digital experiences. Focused on user-centered design principles and accessibility.",
      company: "Design Studio"
    },
    {
      name: "Jessica Taylor",
      email: "jessica@example.com",
      image: "https://i.pravatar.cc/150?u=jessica",
      headline: "Product Manager",
      bio: "Bridging the gap between business, technology, and user needs. Experienced in agile methodologies and product strategy.",
      company: "Product Co"
    }
  ];

  for (const u of mockUsers) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (!exists) {
      const user = await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          password: password,
          role: UserRole.JOB_SEEKER,
          status: UserStatus.ACTIVE,
          emailVerified: true,
          image: u.image,
          jobSeekerProfile: {
            create: {
              name: u.name,
              headline: u.headline,
              bio: u.bio,
              workExperience: {
                create: [
                  {
                    companyName: u.company,
                    title: u.headline.split(' at ')[0],
                    startDate: new Date("2020-01-01"),
                  }
                ]
              }
            }
          }
        }
      });
      console.log(`Created user: ${user.name}`);
    } else {
      console.log(`User already exists: ${u.name}`);
    }
  }
  
  console.log("Job seeker seeding completed!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
