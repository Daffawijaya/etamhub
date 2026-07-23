import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/umkm.json");

async function run() {
  const file = await fs.readFile(filePath, "utf8");
  const umkms = JSON.parse(file);

  const updated = umkms.map((item: any) => ({
    ...item,
    updatedAt: item.updatedAt ?? item.createdAt,
  }));

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

  console.log("✅ Semua data berhasil ditambahkan updatedAt");
}

run();