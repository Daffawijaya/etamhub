import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(
  process.cwd(),
  "src/data/umkm.json"
);


// GET semua UMKM
export async function GET() {
  const file = await fs.readFile(filePath, "utf-8");

  const umkms = JSON.parse(file);

  return NextResponse.json(umkms);
}


// TAMBAH UMKM
export async function POST(req: Request) {
  const body = await req.json();

  const file = await fs.readFile(filePath, "utf-8");

  const umkms = JSON.parse(file);


  const newUmkm = {
    id: Date.now(),
    ...body,
  };


  umkms.push(newUmkm);


  await fs.writeFile(
    filePath,
    JSON.stringify(umkms, null, 2)
  );


  return NextResponse.json({
    success: true,
    data: newUmkm,
  });
}