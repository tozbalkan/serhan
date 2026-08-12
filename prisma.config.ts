import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Central Prisma configuration (Prisma ORM v7).
// The database URL is resolved from the environment via the type-safe `env()`
// helper; it is intentionally NOT hardcoded in schema.prisma.
export default defineConfig({
  // Main schema entry point.
  schema: "prisma/schema.prisma",
  // Where migrations are stored.
  migrations: {
    path: "prisma/migrations",
  },
  // Database connection string (PostgreSQL).
  datasource: {
    url: env("DATABASE_URL"),
  },
});
