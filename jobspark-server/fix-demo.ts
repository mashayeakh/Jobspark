import { prisma } from './src/app/lib/prisma';
import { auth } from './src/app/lib/auth';
import { UserStatus } from './prisma/generated/prisma/client';

async function main() {
  const email = "demojob_seeker@gmail.com";
  
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // 1. Delete associated connections to satisfy foreign key constraints
      await prisma.connection.deleteMany({
        where: {
          OR: [
            { senderId: existing.id },
            { receiverId: existing.id }
          ]
        }
      });
      console.log("Deleted associated connections");

      // 2. Delete the user
      await prisma.user.delete({ where: { id: existing.id } });
      console.log("Deleted old broken user record");
    }

    // 3. Recreate properly
    const result = await auth.api.signUpEmail({
      body: {
        email: email,
        password: "Password123!",
        name: "Demo",
        role: "JOB_SEEKER",
      },
    });

    if (result && result.user) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { emailVerified: true, status: UserStatus.ACTIVE },
      });
      
      await prisma.jobSeekerProfile.create({
        data: {
          userId: result.user.id,
          name: "Demo",
          headline: "Tech Professional",
          bio: "Excited to connect!",
        }
      });
      console.log(`✅ Successfully created pristine account for: ${email}`);
    }
  } catch (err: any) {
    console.error(`❌ Failed:`, err.message);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
