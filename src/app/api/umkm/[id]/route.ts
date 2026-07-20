import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/umkm.json");

// UPDATE UMKM
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const body = await req.json();

  const file = await fs.readFile(filePath, "utf-8");

  const umkms = JSON.parse(file);

  const index = umkms.findIndex((u: any) => u.id === Number(id));

  if (index === -1) {
    return NextResponse.json(
      { message: "UMKM tidak ditemukan" },
      { status: 404 },
    );
  }

  umkms[index] = {
    ...umkms[index],
    ...body,
    id: Number(id),
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

  let umkms = JSON.parse(file);

  const filtered = umkms.filter((u: any) => u.id !== Number(id));

  if (filtered.length === umkms.length) {
    return NextResponse.json(
      { message: "UMKM tidak ditemukan" },
      { status: 404 },
    );
  }

  await fs.writeFile(filePath, JSON.stringify(filtered, null, 2));

  return NextResponse.json({
    success: true,
  });
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const file = await fs.readFile(filePath, "utf-8");

  const umkms = JSON.parse(file);

  const umkm = umkms.find((u: any) => u.id === Number(id));

  if (!umkm) {
    return NextResponse.json({ message: "Tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(umkm);
}
