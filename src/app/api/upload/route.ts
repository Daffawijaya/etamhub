import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  const data = await req.formData();

  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { message: "File tidak ditemukan" },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop();

  const filename =
    `${uuid()}.${ext}`;

  const uploadPath = path.join(
    process.cwd(),
    "public/uploads/umkm",
    filename
  );

  await fs.writeFile(
    uploadPath,
    buffer
  );

  return NextResponse.json({
    success: true,
    url: `/uploads/umkm/${filename}`,
  });
}