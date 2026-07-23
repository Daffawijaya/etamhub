import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/umkm.json");

export async function POST(req: Request) {
  const excelData = await req.json();

  const file = await fs.readFile(filePath, "utf-8");
  const umkms = JSON.parse(file);

  const newData = excelData.map((item: any) => {
    const now = new Date().toISOString();

    return {
      id: crypto.randomUUID(),

      nama: item["Nama UMKM"] ?? "",

      pemilik: item["Pemilik"] ?? "",

      kategori: item["Kategori"] ?? "",

      subkategori: item["Subkategori"] ?? "",

      deskripsi: item["Deskripsi usaha"] ?? "",

      kecamatan: item["Kecamatan"] ?? "",

      alamat: item["Alamat lengkap"] ?? "",

      lat: Number(item["Latitude"]) || 0,

      lng: Number(item["Longitude"]) || 0,

      whatsapp: item["whatsapp"] ?? "",

      instagram: item["instagram"] ?? "",

      facebook: item["facebook url"] ?? "",

      tiktok: item["tiktok"] ?? "",

      gambar: item["Foto usaha/produk"]
        ? item["Foto usaha/produk"]
            .split(",")
            .map((img: string) => img.trim())
            .filter(Boolean)
        : [],

      createdAt: now,
      updatedAt: now,
    };
  });

  const updated = [...umkms, ...newData];

  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

  return NextResponse.json({
    success: true,
    total: newData.length,
  });
}
