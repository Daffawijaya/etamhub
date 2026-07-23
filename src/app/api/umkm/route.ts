import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const umkmPath = path.join(process.cwd(), "src/data/umkm.json");
const notificationPath = path.join(
  process.cwd(),
  "src/data/notifications.json",
);

// GET semua UMKM
export async function GET() {
  const file = await fs.readFile(umkmPath, "utf-8");
  const umkms = JSON.parse(file);

  return NextResponse.json(umkms);
}

// TAMBAH UMKM
export async function POST(req: Request) {
  const body = await req.json();

  // Ambil data UMKM
  const umkmFile = await fs.readFile(umkmPath, "utf-8");
  const umkms = JSON.parse(umkmFile);

  // Ambil data notifikasi
  const notificationFile = await fs.readFile(notificationPath, "utf-8");
  const notifications = JSON.parse(notificationFile);

  const now = new Date().toISOString();

  const newUmkm = {
    id: crypto.randomUUID(),
    ...body,
    createdAt: now,
    updatedAt: now,
  };

  // Simpan UMKM
  umkms.push(newUmkm);

  // Tambah notifikasi
  notifications.unshift({
    id: crypto.randomUUID(),
    type: "create",
    title: `Tambah UMKM ${newUmkm.nama}`,
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

  // Simpan UMKM
  await fs.writeFile(umkmPath, JSON.stringify(umkms, null, 2), "utf-8");

  // Simpan notifikasi
  await fs.writeFile(
    notificationPath,
    JSON.stringify(filteredNotifications, null, 2),
    "utf-8",
  );

  return NextResponse.json({
    success: true,
    data: newUmkm,
  });
}
