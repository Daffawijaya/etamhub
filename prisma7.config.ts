// Prisma 7 config - Supabase Postgres (pooler + direct)
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prisma 7: url untuk migrate (pakai DIRECT_URL direct 5432, fallback DATABASE_URL)
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
