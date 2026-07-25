import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          message: "File tidak ditemukan.",
        },
        {
          status: 400,
        },
      );
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message: "Format file harus JPG, JPEG, PNG, atau WEBP.",
        },
        {
          status: 400,
        },
      );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          message: "Ukuran file maksimal 5 MB.",
        },
        {
          status: 400,
        },
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    // Convert ke WebP + resize jika terlalu besar
    const webpBuffer = await sharp(inputBuffer)
      .rotate() // mengikuti orientasi kamera HP
      .resize({
        width: 1920,
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 6,
      })
      .toBuffer();

    const filename = `${uuid()}.webp`;

    const uploadData = new Uint8Array(webpBuffer);

    const { error } = await supabase.storage
      .from("umkm-images")
      .upload(filename, uploadData, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("umkm-images")
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      filename,
      url: data.publicUrl,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat upload file.",
      },
      {
        status: 500,
      },
    );
  }
}
