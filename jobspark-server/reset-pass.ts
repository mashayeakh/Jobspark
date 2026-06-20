import { prisma } from './src/app/lib/prisma';
import { auth } from './src/app/lib/auth';
import { UserRole, UserStatus } from './prisma/generated/prisma/client';

const USERS_TO_FIX = [
  { email: "sarah@example.com", name: "Sarah Jenkins", role: "JOB_SEEKER" },
  { email: "david@example.com", name: "David Kim", role: "JOB_SEEKER" },
  { email: "emily@example.com", name: "Emily Rodriguez", role: "JOB_SEEKER" },
  { email: "michael@example.com", name: "Michael Chen", role: "JOB_SEEKER" },
  { email: "jessica@example.com", name: "Jessica Taylor", role: "JOB_SEEKER" },
  { email: "demojob_seeker@gmail.com", name: "Demo", role: "JOB_SEEKER" },
];

const PASSWORD = "Recruit@123";

async function main() {
  console.log("Completely rebuilding user accounts for Better Auth...\n");

  for (const u of USERS_TO_FIX) {
    try {
      // 1. Delete the user entirely if they exist
      const existing = await prisma.user.findUnique({ where: { email: u.email } });
      if (existing) {
        await prisma.user.delete({ where: { id: existing.id } });
        console.log(`Deleted old broken record for: ${u.email}`);
      }

      // 2. Create the user cleanly via Better Auth
      const result = await auth.api.signUpEmail({
        body: {
          email: u.email,
          password: PASSWORD,
          name: u.name,
          role: u.role,
        },
      });

      if (result && result.user) {
        // 3. Make sure they are active and verified
        await prisma.user.update({
          where: { id: result.user.id },
          data: { emailVerified: true, status: UserStatus.ACTIVE },
        });

        // 4. Create the JobSeeker profile
        await prisma.jobSeekerProfile.create({
          data: {
            userId: result.user.id,
            name: u.name,
            headline: "Tech Professional",
            bio: "Excited to connect!",
          }
        });
        console.log(`✅ Successfully created pristine account for: ${u.email}`);
      }
    } catch (err: any) {
      console.error(`❌ Failed for ${u.email}:`, err.message);
    }
  }

  console.log("\n✅ Done! ALL users can now definitively log in with: Recruit@123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
