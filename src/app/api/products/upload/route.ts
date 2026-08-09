import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "product-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const productId = formData.get("product_id");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File gambar wajib diisi." },
        { status: 400 },
      );
    }

    if (typeof productId !== "string" || !productId) {
      return NextResponse.json(
        { error: "product_id wajib diisi." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: "Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "Ukuran gambar maksimal 5 MB.",
        },
        { status: 400 },
      );
    }

    const { data: product, error: productError } = await supabase
      .from("products")
      .select(
        `
          id,
          umkm_id,
          umkm:umkm_id (
            id,
            owner_id
          )
        `,
      )
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan." },
        { status: 404 },
      );
    }

    const umkm = Array.isArray(product.umkm) ? product.umkm[0] : product.umkm;

    if (!umkm || umkm.owner_id !== userId) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses ke produk ini." },
        { status: 403 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const webpBuffer = await sharp(buffer)
      .rotate()
      .webp({
        quality: 82,
      })
      .toBuffer();

    const fileName = `${crypto.randomUUID()}.webp`;
    const filePath = `${productId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, webpBuffer, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Product image upload error:", uploadError);

      return NextResponse.json(
        { error: "Gagal mengupload gambar produk." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        path: filePath,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Product upload error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengupload gambar." },
      { status: 500 },
    );
  }
}
