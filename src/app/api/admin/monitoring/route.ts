import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
      .select("id, nama, pemilik, kategori, kecamatan, kecamatan_id, gambar")
      .eq("published", true)
      .order("nama", { ascending: true });

    if (user.role === "admin_kecamatan" && user.kecamatanIds.length > 0) {
      umkmQuery = umkmQuery.in("kecamatan_id", user.kecamatanIds);
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

    const result = (umkms ?? []).map((umkm) => ({
      ...umkm,
      latestMonitoring: monitoringMap[umkm.id] ?? null,
      monitoringCount: countMap[umkm.id] ?? 0,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET MONITORING ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
