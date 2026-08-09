import { createClient } from "@supabase/supabase-js";
import {
  type ProductLegalitas,
  allowedJenis,
  validateLegalitas,
} from "@/lib/products/legalitas";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export function normalizeLegalitas(legalitas: unknown): ProductLegalitas[] {
  if (!Array.isArray(legalitas)) {
    return [];
  }

  const normalizedLegalitas: ProductLegalitas[] = legalitas
    .filter(
      (item): item is ProductLegalitas =>
        item !== null &&
        typeof item === "object" &&
        "jenis" in item &&
        allowedJenis.includes((item as ProductLegalitas).jenis),
    )
    .map((item) => ({
      jenis: item.jenis,
      kode:
        item.jenis === "kbli" && item.kode ? String(item.kode).trim() : null,
    }));

  return Array.from(
    new Map(
      normalizedLegalitas.map((item) => [
        `${item.jenis}:${item.kode ?? ""}`,
        item,
      ]),
    ).values(),
  );
}

export async function updateProductLegalitas(
  productId: string,
  umkmId: string,
  legalitas: ProductLegalitas[],
) {
  const validation = await validateLegalitas(umkmId, legalitas);

  if (!validation.valid) {
    return validation;
  }

  const { error: deleteLegalitasError } = await supabase
    .from("product_legalitas")
    .delete()
    .eq("product_id", productId);

  if (deleteLegalitasError) {
    console.error("Delete old product legalitas error:", deleteLegalitasError);

    return {
      valid: false,
      status: 500,
      message: "Gagal memperbarui legalitas produk",
      error: deleteLegalitasError.message,
    };
  }

  if (legalitas.length > 0) {
    const legalitasPayload = legalitas.map((item) => ({
      product_id: productId,
      jenis: item.jenis,
      kode: item.jenis === "kbli" ? item.kode : null,
    }));

    const { error: insertLegalitasError } = await supabase
      .from("product_legalitas")
      .insert(legalitasPayload);

    if (insertLegalitasError) {
      console.error("Insert product legalitas error:", insertLegalitasError);

      return {
        valid: false,
        status: 500,
        message: "Gagal menyimpan legalitas produk",
        error: insertLegalitasError.message,
      };
    }
  }

  return {
    valid: true,
    status: 200,
    message: "Legalitas produk berhasil diperbarui",
  };
}
