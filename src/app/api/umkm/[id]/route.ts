import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const umkmPath = path.join(process.cwd(), "src/data/umkm.json");

const notificationPath = path.join(
  process.cwd(),
  "src/data/notifications.json",
);

const MAX_NOTIFICATION_AGE = 30 * 24 * 60 * 60 * 1000;

function cleanNotifications(notifications: any[]) {
  const now = Date.now();

  return notifications.filter(
    (item) => now - new Date(item.createdAt).getTime() <= MAX_NOTIFICATION_AGE,
  );
}

// =========================
// GET UMKM BY ID
// =========================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const file = await fs.readFile(umkmPath, "utf-8");
  const umkms = JSON.parse(file);

  const umkm = umkms.find((u: any) => String(u.id) === id);

  if (!umkm) {
    return NextResponse.json(
      {
        message: "UMKM tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(umkm);
}

// =========================
// UPDATE UMKM
// =========================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const body = await req.json();

  const umkmFile = await fs.readFile(umkmPath, "utf-8");
  const umkms = JSON.parse(umkmFile);

  const notificationFile = await fs.readFile(notificationPath, "utf-8");
  let notifications = JSON.parse(notificationFile);

  notifications = cleanNotifications(notifications);

  const index = umkms.findIndex((u: any) => String(u.id) === id);

  if (index === -1) {
    return NextResponse.json(
      {
        message: "UMKM tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }

  const now = new Date().toISOString();

  umkms[index] = {
    ...umkms[index],
    ...body,
    id: umkms[index].id,
    createdAt: umkms[index].createdAt,
    updatedAt: now,
  };

  notifications.unshift({
    id: crypto.randomUUID(),
    type: "update",
    title: `Update UMKM ${umkms[index].nama}`,
    createdAt: now,
    read: false,
  });

  await fs.writeFile(umkmPath, JSON.stringify(umkms, null, 2), "utf-8");

  await fs.writeFile(
    notificationPath,
    JSON.stringify(notifications, null, 2),
    "utf-8",
  );

  return NextResponse.json({
    success: true,
    data: umkms[index],
  });
}

// =========================
// DELETE UMKM
// =========================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const umkmFile = await fs.readFile(umkmPath, "utf-8");
  const umkms = JSON.parse(umkmFile);

  const notificationFile = await fs.readFile(notificationPath, "utf-8");
  let notifications = JSON.parse(notificationFile);

  notifications = cleanNotifications(notifications);

  const target = umkms.find((u: any) => String(u.id) === id);

  if (!target) {
    return NextResponse.json(
      {
        message: "UMKM tidak ditemukan",
      },
      {
        status: 404,
      },
    );
  }

  // =========================
  // Hapus gambar
  // =========================
  if (Array.isArray(target.gambar)) {
    for (const image of target.gambar) {
      const imagePath = path.join(process.cwd(), "public", image);

      try {
        await fs.unlink(imagePath);
      } catch {
        console.log("Gagal hapus gambar:", image);
      }
    }
  }

  // =========================
  // Hapus data UMKM
  // =========================
  const filtered = umkms.filter((u: any) => String(u.id) !== id);

  notifications.unshift({
    id: crypto.randomUUID(),
    type: "delete",
    title: `Hapus UMKM ${target.nama}`,
    createdAt: new Date().toISOString(),
    read: false,
  });

  await fs.writeFile(umkmPath, JSON.stringify(filtered, null, 2), "utf-8");

  await fs.writeFile(
    notificationPath,
    JSON.stringify(notifications, null, 2),
    "utf-8",
  );

  return NextResponse.json({
    success: true,
  });
}
