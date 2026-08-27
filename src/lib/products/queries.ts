import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const PRODUCT_DETAIL_SELECT = `
  id,
  umkm_id,
  nama,
  deskripsi,
  harga,
  satuan,
  gambar,
  is_available,
  created_at,
  updated_at,
  umkm:umkm_id (
    halal,
    pirt,
    haki,
    kbli
  ),
  product_legalitas (
    id,
    product_id,
    jenis,
    kode,
    created_at
  )
`;

export async function getProductById(id: string) {
  return await supabaseAdmin
    .from("products")
    .select(PRODUCT_DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();
}

export async function getExistingProduct(id: string) {
  return await supabaseAdmin
    .from("products")
    .select("id, umkm_id, gambar")
    .eq("id", id)
    .maybeSingle();
}

export async function getProductBasicById(id: string) {
  return await supabaseAdmin
    .from("products")
    .select("id")
    .eq("id", id)
    .maybeSingle();
}

export async function getUmkmById(id: string) {
  return await supabaseAdmin
    .from("umkm")
    .select("id, halal, pirt, haki, kbli")
    .eq("id", id)
    .maybeSingle();
}

export async function updateProduct(
  id: string,
  updatePayload: Record<string, unknown>,
) {
  return await supabaseAdmin
    .from("products")
    .update(updatePayload)
    .eq("id", id)
    .select(
      `
        id,
        umkm_id,
        nama,
        deskripsi,
        harga,
        satuan,
        gambar,
        is_available,
        created_at,
        updated_at
      `,
    )
    .single();
}

export async function deleteProduct(id: string) {
  return await supabaseAdmin.from("products").delete().eq("id", id);
}
