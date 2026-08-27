/**
 * Import KBLI data from Excel to Supabase database.
 *
 * Usage:
 *   npx tsx scripts/import-kbli.ts
 *
 * Requirements:
 *   - File: public/daftar-kbli-2025.xlsx
 *   - Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const filePath = "public/daftar-kbli-2025.xlsx";

  console.log(`Reading ${filePath}...`);

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<{
    "Kode KBLI": string;
    "Judul (Indonesia)": string;
    "Title (English)": string;
  }>(sheet);

  console.log(`Found ${rows.length} KBLI entries`);

  // Map to our format
  const data = rows.map((row) => ({
    kode: String(row["Kode KBLI"]).trim(),
    nama_id: String(row["Judul (Indonesia)"]).trim(),
    nama_en: String(row["Title (English)"]).trim() || null,
  }));

  // Batch insert (500 at a time)
  const batchSize = 500;
  let inserted = 0;

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);

    const { error, count } = await supabase
      .from("kbli")
      .upsert(batch, { onConflict: "kode", count: "exact" });

    if (error) {
      console.error(`Batch ${i / batchSize + 1} failed:`, error.message);
    } else {
      inserted += count ?? batch.length;
      console.log(
        `Batch ${i / batchSize + 1}: ${count ?? batch.length} rows inserted`,
      );
    }
  }

  console.log(`Done! Total inserted/updated: ${inserted}`);
}

main().catch(console.error);
