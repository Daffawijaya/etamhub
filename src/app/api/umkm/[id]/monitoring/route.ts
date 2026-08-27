import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// =========================
// GET — Public monitoring history for a specific UMKM
// =========================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    // Verify UMKM exists and is published
    const { data: umkm, error: umkmError } = await supabaseAdmin
      .from("umkm")
      .select("id, nama, deskripsi, gambar, omzet, jumlah_tenaga_kerja, npwp, nib, halal, pirt, haki, instagram, facebook, tiktok")
      .eq("id", id)
      .eq("published", true)
      .single();

    if (umkmError || !umkm) {
      return NextResponse.json(
        { message: "UMKM tidak ditemukan" },
        { status: 404 },
      );
    }

    // Get monitoring history
    const { data: monitorings, error: monError } = await supabaseAdmin
      .from("umkm_monitoring")
      .select("id, created_at, jumlah_tenaga_kerja, omzet, npwp, nib, halal, pirt, haki, kbli, instagram, facebook, tiktok, kebutuhan_utama, catatan")
      .eq("umkm_id", id)
      .order("created_at", { ascending: false });

    if (monError) throw monError;

    // Build initial data from UMKM record
    const initial = {
      nama: umkm.nama ?? null,
      deskripsi: umkm.deskripsi ?? null,
      gambar: umkm.gambar ?? null,
      omzet: umkm.omzet ?? null,
      jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja ?? null,
      npwp: umkm.npwp ?? null,
      nib: umkm.nib ?? null,
      halal: umkm.halal ?? null,
      pirt: umkm.pirt ?? null,
      haki: umkm.haki ?? null,
      instagram: umkm.instagram ?? null,
      facebook: umkm.facebook ?? null,
      tiktok: umkm.tiktok ?? null,
    };

    // Build latest monitoring data (merge UMKM initial + latest monitoring)
    const latestEntry = (monitorings ?? [])[0] ?? null;
    const latest = latestEntry
      ? {
          nama: initial.nama,
          deskripsi: initial.deskripsi,
          gambar: initial.gambar,
          omzet: latestEntry.omzet ?? initial.omzet,
          jumlah_tenaga_kerja: latestEntry.jumlah_tenaga_kerja ?? initial.jumlah_tenaga_kerja,
          npwp: latestEntry.npwp ?? initial.npwp,
          nib: latestEntry.nib ?? initial.nib,
          halal: latestEntry.halal ?? initial.halal,
          pirt: latestEntry.pirt ?? initial.pirt,
          haki: latestEntry.haki ?? initial.haki,
          instagram: latestEntry.instagram ?? initial.instagram,
          facebook: latestEntry.facebook ?? initial.facebook,
          tiktok: latestEntry.tiktok ?? initial.tiktok,
        }
      : initial;

    return NextResponse.json({
      initial,
      latest,
      monitorings: monitorings ?? [],
      totalMonitoring: (monitorings ?? []).length,
      nama: umkm.nama,
    });
  } catch (error: any) {
    console.error("GET PUBLIC MONITORING ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
