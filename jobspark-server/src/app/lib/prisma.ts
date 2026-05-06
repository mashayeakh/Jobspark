import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { envVars } from "../config/env";
import { PrismaPg } from "@prisma/adapter-pg";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = `${envVars.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
