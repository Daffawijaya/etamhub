import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          message: "File tidak ditemukan",
        },
        {
          status: 400,
        }
      );
    }

    // Validasi ekstensi
    const allowedExtensions = [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ];

    const ext = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        {
          message:
            "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.",
        },
        {
          status: 400,
        }
      );
    }


    // Validasi ukuran 5MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          message: "Ukuran file maksimal 5MB.",
        },
        {
          status: 400,
        }
      );
    }


    // Folder upload
    const uploadDir = path.join(
      process.cwd(),
      "public/uploads/umkm"
    );


    await fs.mkdir(uploadDir, {
      recursive: true,
    });


    // UUID hanya untuk nama file
    const filename = `${uuid()}.${ext}`;

    const filepath = path.join(
      uploadDir,
      filename
    );


    const buffer = Buffer.from(
      await file.arrayBuffer()
    );


    await fs.writeFile(
      filepath,
      buffer
    );


    const imageUrl = `/uploads/umkm/${filename}`;


    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename,
    });


  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Terjadi kesalahan saat upload file.",
      },
      {
        status: 500,
      }
    );
  }
}