import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateBadge } from "@/lib/monitoring/badges";

// =========================
// GET — List all UMKM with latest monitoring for admin kecamatan
// =========================
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const allowedRoles = ["super_admin", "admin_kecamatan"];
    if (!allowedRoles.includes(user.role ?? "")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get UMKM from assigned kecamatan
    let umkmQuery = supabaseAdmin
      .from("umkm")
      .select("id, nama, pemilik, kategori, kecamatan, kecamatan_id, gambar, omzet, jumlah_tenaga_kerja, halal, pirt, haki, instagram, facebook, tiktok")
      .eq("published", true)
      .order("nama", { ascending: true });

    if (user.role === "admin_kecamatan" && user.kecamatanIds.length > 0) {
      umkmQuery = umkmQuery.or(
        `kecamatan_id.in.(${user.kecamatanIds.join(",")}),kecamatan.in.(${user.kecamatan.join(",")})`,
      );
    }

    const { data: umkms, error: umkmError } = await umkmQuery;

    if (umkmError) throw umkmError;

    // Get latest monitoring for each UMKM
    const umkmIds = (umkms ?? []).map((u) => u.id);

    let monitoringMap: Record<string, any> = {};

    if (umkmIds.length > 0) {
      // Get latest monitoring per UMKM
      const { data: monitorings } = await supabaseAdmin
        .from("umkm_monitoring")
        .select("*")
        .in("umkm_id", umkmIds)
        .order("created_at", { ascending: false });

      // Group by umkm_id, keep only latest
      for (const m of monitorings ?? []) {
        if (!monitoringMap[m.umkm_id]) {
          monitoringMap[m.umkm_id] = m;
        }
      }
    }

    // Get monitoring count per UMKM
    const { data: counts } = umkmIds.length > 0
      ? await supabaseAdmin
          .from("umkm_monitoring")
          .select("umkm_id")
          .in("umkm_id", umkmIds)
      : { data: [] };

    const countMap: Record<string, number> = {};
    for (const c of counts ?? []) {
      countMap[c.umkm_id] = (countMap[c.umkm_id] || 0) + 1;
    }

    const result = (umkms ?? []).map((umkm) => {
      const monitoringCount = countMap[umkm.id] ?? 0;
      const latestEntry = monitoringMap[umkm.id] ?? null;

      const initial = {
        omzet: umkm.omzet ?? null,
        jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja ?? null,
        halal: umkm.halal ?? null,
        pirt: umkm.pirt ?? null,
        haki: umkm.haki ?? null,
        instagram: umkm.instagram ?? null,
        facebook: umkm.facebook ?? null,
        tiktok: umkm.tiktok ?? null,
      };

      const latest = latestEntry
        ? {
            omzet: latestEntry.omzet ?? initial.omzet,
            jumlah_tenaga_kerja: latestEntry.jumlah_tenaga_kerja ?? initial.jumlah_tenaga_kerja,
            halal: latestEntry.halal ?? initial.halal,
            pirt: latestEntry.pirt ?? initial.pirt,
            haki: latestEntry.haki ?? initial.haki,
            instagram: latestEntry.instagram ?? initial.instagram,
            facebook: latestEntry.facebook ?? initial.facebook,
            tiktok: latestEntry.tiktok ?? initial.tiktok,
          }
        : initial;

      const badge = calculateBadge(initial, latest, monitoringCount);

      return {
        id: umkm.id,
        nama: umkm.nama,
        pemilik: umkm.pemilik,
        kategori: umkm.kategori,
        kecamatan: umkm.kecamatan,
        kecamatan_id: umkm.kecamatan_id,
        gambar: umkm.gambar,
        latestMonitoring: latestEntry,
        monitoringCount,
        badge,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET MONITORING ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
