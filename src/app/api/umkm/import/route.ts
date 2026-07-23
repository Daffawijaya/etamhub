import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const umkmPath = path.join(process.cwd(), "src/data/umkm.json");

const notificationPath = path.join(
  process.cwd(),
  "src/data/notifications.json",
);

export async function POST(req: Request) {
  try {
    const excelData = await req.json();

    const umkmFile = await fs.readFile(umkmPath, "utf-8");
    const umkms = JSON.parse(umkmFile);

    const notificationFile = await fs.readFile(notificationPath, "utf-8");
    const notifications = JSON.parse(notificationFile);

    const now = new Date().toISOString();

    const newData = excelData.map((item: any) => ({
      id: crypto.randomUUID(),

      nama: String(item["Nama UMKM"] ?? ""),

      pemilik: String(item["Pemilik"] ?? ""),

      kategori: String(item["Kategori"] ?? ""),

      subkategori: String(item["Subkategori"] ?? ""),

      deskripsi: String(item["Deskripsi usaha"] ?? ""),

      kecamatan: String(item["Kecamatan"] ?? ""),

      alamat: String(item["Alamat lengkap"] ?? ""),

      lat: Number(item["Latitude"]) || 0,

      lng: Number(item["Longitude"]) || 0,

      whatsapp: item["whatsapp"]
        ? (() => {
            const phone = String(item["whatsapp"]).replace(/\.0$/, "");

            return phone.startsWith("0") ? phone : `0${phone}`;
          })()
        : "",

      instagram: String(item["instagram"] ?? ""),

      facebook: String(item["facebook url"] ?? ""),

      tiktok: String(item["tiktok"] ?? ""),

      gambar: item["Foto usaha/produk"]
        ? String(item["Foto usaha/produk"])
            .split(",")
            .map((img: string) => img.trim())
            .filter(Boolean)
        : [],

      createdAt: now,
      updatedAt: now,
    }));

    const updated = [...umkms, ...newData];

    await fs.writeFile(umkmPath, JSON.stringify(updated, null, 2), "utf-8");

    // Tambah notifikasi import
    notifications.unshift({
      id: crypto.randomUUID(),
      type: "import",
      title: `Import ${newData.length} data UMKM`,
      createdAt: now,
      read: false,
    });

    // =========================
    // Hapus notifikasi lebih dari 30 hari
    // =========================
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const nowTime = Date.now();

    const filteredNotifications = notifications.filter((item: any) => {
      return nowTime - new Date(item.createdAt).getTime() <= THIRTY_DAYS;
    });

    await fs.writeFile(
      notificationPath,
      JSON.stringify(filteredNotifications, null, 2),
      "utf-8",
    );

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
