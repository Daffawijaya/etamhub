import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
        },
      );
    }

    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json(
        {
          message:
            "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau WEBP.",
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
          message: "Ukuran file maksimal 5MB.",
        },
        {
          status: 400,
        },
      );
    }

    const filename = `${uuid()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from("umkm-images")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrl } = supabase.storage
      .from("umkm-images")
      .getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      url: publicUrl.publicUrl,
      filename,
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
