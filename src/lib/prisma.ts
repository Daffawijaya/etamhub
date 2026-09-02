import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton PrismaClient untuk Next.js (hindari hot-reload leak)
// Usage: import { prisma } from "@/lib/prisma"; await prisma.umkm.findMany()

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
  if (!process.env.DATABASE_URL) {
    console.warn("[prisma] DATABASE_URL belum diisi - pakai dummy, isi .env sebelum migrate/query");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
