import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({
  path: ".env.local",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

const filePath = path.join(process.cwd(), "src/data/umkm.json");

const umkms = JSON.parse(fs.readFileSync(filePath, "utf-8"));

console.log("Jumlah data:", umkms.length);

async function importUmkm() {
  console.log("Mulai import...");

  const { error } = await supabase.from("umkm").insert(
    umkms.map((item: any) => ({
      id: crypto.randomUUID(),
      nama: item.nama,
      pemilik: item.pemilik,
      kategori: item.kategori,
      subkategori: item.subkategori,
      deskripsi: item.deskripsi,
      kecamatan: item.kecamatan,
      alamat: item.alamat,
      lat: item.lat,
      lng: item.lng,
      whatsapp: item.whatsapp,
      instagram: item.instagram,
      facebook: item.facebook,
      tiktok: item.tiktok,
      gambar: item.gambar,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
    })),
  );

  if (error) {
    console.error("ERROR:", error.message);
    return;
  }

  console.log("✅ Import UMKM berhasil");
}

importUmkm()
  .then(() => {
    console.log("Selesai");
  })
  .catch((error) => {
    console.error("ERROR:", error);
  });
