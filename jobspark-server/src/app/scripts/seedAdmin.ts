import { envVars } from "../config/env";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { UserRole } from "prisma/generated/prisma/enums";


export const seedAdmin = async () => {
  try {
    const adminEmail = envVars.ADMIN_EMAIL;

    // Check if admin user already exists
    let adminUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminUser) {
      console.log("Admin not found. Creating...");

      // Create via Better Auth so the password is hashed correctly
      const adminCreation = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: envVars.ADMIN_PASSWORD,
          name: "Admin",
          role: UserRole.ADMIN,
        },
      });

      adminUser = await prisma.user.findUnique({
        where: { id: adminCreation?.user.id as string },
      });
    }

    if (!adminUser) {
      throw new Error("Failed to resolve admin user during bootstrap.");
    }

    // Ensure role, emailVerified, and status are correct
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        emailVerified: true,
        role: UserRole.ADMIN,
        status: "ACTIVE",
      },
    });

    console.log(`✅ Admin bootstrap completed for: ${adminEmail}`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};
