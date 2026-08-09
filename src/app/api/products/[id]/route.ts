import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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
import type { ProductLegalitasInput } from "@/types/product";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const normalizeLegalitas = (legalitas: ProductLegalitasInput[]) =>
  Array.from(
    new Map(
      legalitas.map((item) => [
        `${item.jenis}:${item.kode ?? ""}`,
        {
          jenis: item.jenis,
          kode: item.kode ?? null,
        },
      ]),
    ).values(),
  );

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
    } = body as ProductUpdateInput;

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

    let normalizedLegalitas: ProductLegalitasInput[] = [];

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

      for (const item of legalitas) {
        if (
          !item ||
          typeof item !== "object" ||
          !["halal", "pirt", "haki", "kbli"].includes(item.jenis)
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Jenis legalitas tidak valid",
            },
            { status: 400 },
          );
        }

        if (item.jenis === "kbli" && !item.kode) {
          return NextResponse.json(
            {
              success: false,
              message: "Kode KBLI wajib diisi",
            },
            { status: 400 },
          );
        }
      }

      const availableKbli = Array.isArray(targetUmkm.kbli)
        ? targetUmkm.kbli.filter(
            (item): item is string =>
              typeof item === "string" && item.trim().length > 0,
          )
        : [];

      for (const item of legalitas) {
        if (item.jenis === "halal" && !targetUmkm.halal) {
          return NextResponse.json(
            {
              success: false,
              message: "UMKM tidak memiliki legalitas Halal",
            },
            { status: 400 },
          );
        }

        if (item.jenis === "pirt" && !targetUmkm.pirt) {
          return NextResponse.json(
            {
              success: false,
              message: "UMKM tidak memiliki legalitas PIRT",
            },
            { status: 400 },
          );
        }

        if (item.jenis === "haki" && !targetUmkm.haki) {
          return NextResponse.json(
            {
              success: false,
              message: "UMKM tidak memiliki legalitas HAKI",
            },
            { status: 400 },
          );
        }

        if (item.jenis === "kbli" && !availableKbli.includes(item.kode!)) {
          return NextResponse.json(
            {
              success: false,
              message: `KBLI ${item.kode} tidak terdaftar pada UMKM`,
            },
            { status: 400 },
          );
        }
      }

      normalizedLegalitas = normalizeLegalitas(legalitas);
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

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk gagal diperbarui",
        },
        { status: 500 },
      );
    }

    if (legalitas !== undefined) {
      const { error: deleteLegalitasError } = await supabase
        .from("product_legalitas")
        .delete()
        .eq("product_id", id);

      if (deleteLegalitasError) {
        console.error("Delete product legalitas error:", deleteLegalitasError);

        return NextResponse.json(
          {
            success: false,
            message: "Gagal memperbarui legalitas produk",
            error: deleteLegalitasError.message,
          },
          { status: 500 },
        );
      }

      if (normalizedLegalitas.length > 0) {
        const legalitasPayload = normalizedLegalitas.map((item) => ({
          product_id: id,
          jenis: item.jenis,
          kode: item.kode ?? null,
        }));

        const { error: insertLegalitasError } = await supabase
          .from("product_legalitas")
          .insert(legalitasPayload);

        if (insertLegalitasError) {
          console.error(
            "Insert product legalitas error:",
            insertLegalitasError,
          );

          return NextResponse.json(
            {
              success: false,
              message: "Gagal menyimpan legalitas produk",
              error: insertLegalitasError.message,
            },
            { status: 500 },
          );
        }
      }
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

    const { data: storageFiles, error: storageListError } =
      await supabase.storage.from("product-images").list(id, {
        limit: 100,
      });

    if (storageListError) {
      console.error("List product images error:", storageListError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memeriksa gambar produk",
          error: storageListError.message,
        },
        { status: 500 },
      );
    }

    const storagePaths = (storageFiles ?? [])
      .filter((file) => file.name)
      .map((file) => `${id}/${file.name}`);

    const { error: deleteError } = await deleteProduct(id);

    if (deleteError) {
      console.error("DELETE /api/products/[id] error:", deleteError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal menghapus produk",
          error: deleteError.message,
        },
        { status: 500 },
      );
    }

    if (storagePaths.length > 0) {
      const { error: storageDeleteError } = await supabase.storage
        .from("product-images")
        .remove(storagePaths);

      if (storageDeleteError) {
        console.error(
          "Delete product images from storage error:",
          storageDeleteError,
        );

        return NextResponse.json({
          success: true,
          message:
            "Produk berhasil dihapus, tetapi gambar produk gagal dihapus dari storage.",
          warning: storageDeleteError.message,
        });
      }
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
