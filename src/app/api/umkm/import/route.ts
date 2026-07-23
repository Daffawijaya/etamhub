import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/umkm.json");

export async function POST(req: Request) {
  try {
    const excelData = await req.json();

    const file = await fs.readFile(filePath, "utf-8");

    const umkms = JSON.parse(file);

    const newData = excelData.map((item: any) => {
      const now = new Date().toISOString();

      return {
        // UUID string
        id: crypto.randomUUID(),

        // Text fields
        nama: String(item["Nama UMKM"] ?? ""),

        pemilik: String(item["Pemilik"] ?? ""),

        kategori: String(item["Kategori"] ?? ""),

        subkategori: String(item["Subkategori"] ?? ""),

        deskripsi: String(item["Deskripsi usaha"] ?? ""),

        kecamatan: String(item["Kecamatan"] ?? ""),

        alamat: String(item["Alamat lengkap"] ?? ""),

        // Coordinate tetap number
        lat: Number(item["Latitude"]) || 0,

        lng: Number(item["Longitude"]) || 0,

        // Pastikan nomor dan sosial media string
        whatsapp: item["whatsapp"]
          ? (() => {
              const phone = String(item["whatsapp"]).replace(/\.0$/, "");

              return phone.startsWith("0") ? phone : `0${phone}`;
            })()
          : "",

        instagram: String(item["instagram"] ?? ""),

        facebook: String(item["facebook url"] ?? ""),

        tiktok: String(item["tiktok"] ?? ""),

        // Multiple image URL
        gambar: item["Foto usaha/produk"]
          ? String(item["Foto usaha/produk"])
              .split(",")
              .map((img: string) => img.trim())
              .filter(Boolean)
          : [],

        createdAt: now,
        updatedAt: now,
      };
    });

    const updated = [...umkms, ...newData];

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      total: newData.length,
    });
  } catch (error) {
    console.error("IMPORT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal import data UMKM",
      },
      {
        status: 500,
      },
    );
  }
}
