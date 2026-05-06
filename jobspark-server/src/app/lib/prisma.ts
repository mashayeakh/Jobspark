import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { envVars } from "../config/env";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = `${envVars.DATABASE_URL}`

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
