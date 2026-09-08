// One-shot: apply prisma/migrations/badge_indicator_flags.sql ke database.
// Usage: npx tsx scripts/apply-badge-flags-migration.ts
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

async function main() {
  const sql = readFileSync(
    join(process.cwd(), "prisma", "migrations", "badge_indicator_flags.sql"),
    "utf8",
  );

  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DIRECT_URL / DATABASE_URL tidak ditemukan di env");
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    await client.query(sql);
    const cols = await client.query(
      "SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'badge_criteria' AND column_name LIKE '%_on' ORDER BY column_name",
    );
    console.table(cols.rows);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
