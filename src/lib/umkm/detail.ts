import { supabaseAdmin } from "../supabaseAdmin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cari UMKM berdasarkan slug kanonis, UUID lama, atau slug lama (history).
export async function lookupUmkm(param: string) {
  const bySlug = await supabaseAdmin
    .from("umkm")
    .select("*")
    .eq("slug", param)
    .maybeSingle();

  if (bySlug.data) {
    return bySlug.data;
  }

  if (UUID_RE.test(param)) {
    const byId = await supabaseAdmin
      .from("umkm")
      .select("*")
      .eq("id", param)
      .maybeSingle();

    if (byId.data) {
      return byId.data;
    }
  }

  const hist = await supabaseAdmin
    .from("slug_history")
    .select("entity_id")
    .eq("entity_type", "umkm")
    .eq("old_slug", param)
    .maybeSingle();

  if (hist.data) {
    const cur = await supabaseAdmin
      .from("umkm")
      .select("*")
      .eq("id", (hist.data as { entity_id: string }).entity_id)
      .maybeSingle();

    if (cur.data) {
      return cur.data;
    }
  }

  return null;
}

/**
 * Merge latest monitoring data into UMKM record.
 * Only fills fields that are null/empty in the UMKM record.
 */
export function mergeMonitoringIntoUmkm(
  umkm: Record<string, any>,
  latest: Record<string, any>,
) {
  const merged = { ...umkm };

  const syncFields = [
    "jumlah_tenaga_kerja",
    "omzet",
    "nib",
    "halal",
    "pirt",
    "haki",
    "kbli",
    "instagram",
    "facebook",
    "tiktok",
  ];

  for (const field of syncFields) {
    if (
      (merged[field] == null ||
        merged[field] === "" ||
        (Array.isArray(merged[field]) && merged[field].length === 0)) &&
      latest[field] != null
    ) {
      merged[field] = latest[field];
    }
  }

  return merged;
}

// UMKM lengkap (owner + monitoring merge). Dipakai halaman publik & API.
export async function getUmkmDetail(param: string) {
  const data = await lookupUmkm(param);

  if (!data) {
    return null;
  }

  if (data.owner_id) {
    const { data: owner } = await supabaseAdmin
      .from("users")
      .select("email, nik")
      .eq("id", data.owner_id)
      .maybeSingle();

    if (owner) {
      data.email = (owner as { email: string }).email;
      data.nik = (owner as { nik: string }).nik;
    }
  }

  const { data: latestMonitoring } = await supabaseAdmin
    .from("umkm_monitoring")
    .select(
      "jumlah_tenaga_kerja, omzet, nib, halal, pirt, haki, kbli, instagram, facebook, tiktok",
    )
    .eq("umkm_id", data.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return latestMonitoring ? mergeMonitoringIntoUmkm(data, latestMonitoring) : data;
}
