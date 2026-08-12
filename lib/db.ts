// Reusable Prisma client for Next.js (development + production).
//
// Prisma ORM v7 notes:
//   - The client is generated to `prisma/generated/prisma` (outside node_modules)
//     and imported from there.
//   - The `prisma-client` provider requires a driver adapter for PostgreSQL.
//     We use `@prisma/adapter-pg` with the native `pg` pool.
//   - This file MUST only run on the server (it opens a real DB connection).
//     Never import it from a Client Component.

import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Set it in your environment (local .env or Vercel project settings).",
  );
}

const adapter = new PrismaPg(connectionString);

const createPrismaClient = () => new PrismaClient({ adapter });

// Reuse a single client across hot-reloads in development to avoid exhausting
// the connection pool.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
