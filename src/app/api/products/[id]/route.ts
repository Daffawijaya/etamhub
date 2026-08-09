import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { allowedJenis, type ProductLegalitas } from "@/lib/products/legalitas";
import {
  normalizeLegalitas,
  updateProductLegalitas,
} from "@/lib/products/legalitas-update";
import {
  deleteProduct,
  getExistingProduct,
  getProductBasicById,
  getProductById,
  getUmkmById,
  updateProduct,
} from "@/lib/products/queries";
import { removeProductImages } from "@/lib/products/storage";
import {
  buildProductUpdatePayload,
  type ProductUpdateInput,
} from "@/lib/products/update-payload";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID produk wajib diisi",
        },
        { status: 400 },
      );
    }

    const { data, error } = await getProductById(id);

    if (error) {
      console.error("GET /api/products/[id] error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data produk",
          error: error.message,
        },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk tidak ditemukan",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/products/[id] unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID produk wajib diisi",
        },
        { status: 400 },
      );
    }

    const body = await request.json();

    const {
      umkm_id,
      nama,
      deskripsi,
      harga,
      satuan,
      gambar,
      is_available,
      legalitas,
    }: ProductUpdateInput & {
      legalitas?: ProductLegalitas[];
    } = body;

    const { data: existingProduct, error: existingProductError } =
      await getExistingProduct(id);

    if (existingProductError) {
      console.error("Get existing product error:", existingProductError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memeriksa produk",
          error: existingProductError.message,
        },
        { status: 500 },
      );
    }

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk tidak ditemukan",
        },
        { status: 404 },
      );
    }

    const oldImages = Array.isArray(existingProduct.gambar)
      ? existingProduct.gambar.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
      : [];

    const targetUmkmId = umkm_id ?? existingProduct.umkm_id;

    let updatePayload: Record<string, unknown>;

    try {
      updatePayload = buildProductUpdatePayload({
        umkm_id,
        nama,
        deskripsi,
        harga,
        satuan,
        gambar,
        is_available,
      });
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Data produk tidak valid",
        },
        { status: 400 },
      );
    }

    if (umkm_id !== undefined) {
      const { data: targetUmkm, error: targetUmkmError } =
        await getUmkmById(targetUmkmId);

      if (targetUmkmError) {
        console.error("Check target UMKM error:", targetUmkmError);

        return NextResponse.json(
          {
            success: false,
            message: "Gagal memeriksa UMKM",
            error: targetUmkmError.message,
          },
          { status: 500 },
        );
      }

      if (!targetUmkm) {
        return NextResponse.json(
          {
            success: false,
            message: "UMKM tidak ditemukan",
          },
          { status: 404 },
        );
      }
    }

    if (legalitas !== undefined) {
      if (!Array.isArray(legalitas)) {
        return NextResponse.json(
          {
            success: false,
            message: "Format legalitas tidak valid",
          },
          { status: 400 },
        );
      }

      const normalizedLegalitas = normalizeLegalitas(legalitas);

      const legalitasResult = await updateProductLegalitas(
        id,
        targetUmkmId,
        normalizedLegalitas,
      );

      if (!legalitasResult.valid) {
        return NextResponse.json(
          {
            success: false,
            message: legalitasResult.message,
            ...(legalitasResult.error ? { error: legalitasResult.error } : {}),
          },
          { status: legalitasResult.status },
        );
      }
    }

    const { data: product, error: productError } = await updateProduct(
      id,
      updatePayload,
    );

    if (productError) {
      console.error("PATCH /api/products/[id] error:", productError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memperbarui produk",
          error: productError.message,
        },
        { status: 500 },
      );
    }

    const newImages = Array.isArray(product.gambar)
      ? product.gambar.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
      : [];

    const removedImages = oldImages.filter(
      (oldImage) => !newImages.includes(oldImage),
    );

    await removeProductImages(removedImages);

    const { data: result, error: resultError } = await getProductById(
      product.id,
    );

    if (resultError) {
      console.error("Get updated product error:", resultError);

      return NextResponse.json({
        success: true,
        message: "Produk berhasil diperbarui",
        data: product,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diperbarui",
      data: result,
    });
  } catch (error) {
    console.error("PATCH /api/products/[id] unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID produk wajib diisi",
        },
        { status: 400 },
      );
    }

    const { data: product, error: productCheckError } =
      await getProductBasicById(id);

    if (productCheckError) {
      console.error("Check product before delete error:", productCheckError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memeriksa produk",
          error: productCheckError.message,
        },
        { status: 500 },
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk tidak ditemukan",
        },
        { status: 404 },
      );
    }

    const { error } = await deleteProduct(id);

    if (error) {
      console.error("DELETE /api/products/[id] error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal menghapus produk",
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] unexpected error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 },
    );
  }
}
