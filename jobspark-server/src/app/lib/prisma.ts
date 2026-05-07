
import { Pool } from "pg";
import { envVars } from "../config/env";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";
import { PrismaClient } from "../../../prisma/generated/prisma/client";


const connectionString = `${envVars.DATABASE_URL}`;

const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

export { prisma };
