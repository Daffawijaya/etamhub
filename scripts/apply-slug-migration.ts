// One-shot: apply prisma/migrations/slug_umkm_products.sql ke database.
// Usage: npx tsx scripts/apply-slug-migration.ts
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

async function main() {
  const sql = readFileSync(
    join(process.cwd(), "prisma", "migrations", "slug_umkm_products.sql"),
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
    const umkm = await client.query(
      "SELECT count(*)::int AS total, count(slug)::int AS filled, count(DISTINCT slug)::int AS uniq FROM umkm",
    );
    const products = await client.query(
      "SELECT count(*)::int AS total, count(slug)::int AS filled, count(DISTINCT slug)::int AS uniq FROM products",
    );
    console.log("umkm:", umkm.rows[0]);
    console.log("products:", products.rows[0]);
    const sample = await client.query(
      "SELECT nama, kecamatan, slug FROM umkm WHERE slug IS NOT NULL ORDER BY created_at DESC LIMIT 5",
    );
    console.table(sample.rows);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
