import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/umkm.json");

// GET UMKM BY ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const file = await fs.readFile(filePath, "utf-8");
  const umkms = JSON.parse(file);

  const umkm = umkms.find((u: any) => String(u.id) === id);

  if (!umkm) {
    return NextResponse.json(
      { message: "UMKM tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(umkm);
}

// UPDATE UMKM
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const body = await req.json();

  const file = await fs.readFile(filePath, "utf-8");
  const umkms = JSON.parse(file);

  const index = umkms.findIndex((u: any) => String(u.id) === id);

  if (index === -1) {
    return NextResponse.json(
      { message: "UMKM tidak ditemukan" },
      { status: 404 },
    );
  }

  umkms[index] = {
    ...umkms[index],
    ...body,
    id: umkms[index].id, // pertahankan id lama
  };

  await fs.writeFile(filePath, JSON.stringify(umkms, null, 2));

  return NextResponse.json({
    success: true,
    data: umkms[index],
  });
}

// DELETE UMKM
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const file = await fs.readFile(filePath, "utf-8");
  const umkms = JSON.parse(file);

  // cari data yang mau dihapus
  const target = umkms.find((u: any) => String(u.id) === id);

  if (!target) {
    return NextResponse.json(
      { message: "UMKM tidak ditemukan" },
      { status: 404 },
    );
  }

  // =========================
  // HAPUS FILE GAMBAR
  // =========================

  if (Array.isArray(target.gambar)) {
    for (const image of target.gambar) {
      const imagePath = path.join(process.cwd(), "public", image);

      try {
        await fs.unlink(imagePath);
      } catch (error) {
        // file tidak ada, lanjut saja
        console.log("Gagal hapus gambar:", image);
      }
    }
  }

  // hapus data json
  const filtered = umkms.filter((u: any) => String(u.id) !== id);

  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

  return NextResponse.json({
    success: true,
  });
}
