import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateBadge } from "@/lib/monitoring/badges";

// =========================
// GET — Monitoring history for a specific UMKM
// =========================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ umkmId: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { umkmId } = await context.params;

    // Get UMKM data as baseline
    const { data: umkm, error: umkmError } = await supabaseAdmin
      .from("umkm")
      .select("*")
      .eq("id", umkmId)
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
      .select("*")
      .eq("umkm_id", umkmId)
      .order("created_at", { ascending: false });

    if (monError) throw monError;

    // Build initial data from UMKM record
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

    // Build latest monitoring data (use latest monitoring entry, falling back to UMKM data)
    const latestEntry = (monitorings ?? [])[0] ?? null;
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

    const badge = calculateBadge(initial, latest, (monitorings ?? []).length);

    return NextResponse.json({
      umkm,
      monitorings: monitorings ?? [],
      badge,
    });
  } catch (error: any) {
    console.error("GET MONITORING HISTORY ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}

// =========================
// POST — Add new monitoring entry
// =========================
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ umkmId: string }> },
) {
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

    const { umkmId } = await context.params;
    const body = await req.json();

    // Verify UMKM exists
    const { data: umkm, error: umkmError } = await supabaseAdmin
      .from("umkm")
      .select("id")
      .eq("id", umkmId)
      .single();

    if (umkmError || !umkm) {
      return NextResponse.json(
        { message: "UMKM tidak ditemukan" },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();

    const { error: insertError } = await supabaseAdmin
      .from("umkm_monitoring")
      .insert({
        id: crypto.randomUUID(),
        umkm_id: umkmId,
        admin_id: user.id,
        created_at: now,

        jumlah_tenaga_kerja: body.jumlah_tenaga_kerja ?? null,
        omzet: body.omzet ?? null,

        halal: body.halal ?? null,
        pirt: body.pirt ?? null,
        haki: body.haki ?? null,
        nib: body.nib ?? null,
        kbli: body.kbli ?? null,

        instagram: body.instagram ?? null,
        facebook: body.facebook ?? null,
        tiktok: body.tiktok ?? null,

        kebutuhan_utama: body.kebutuhan_utama ?? null,
        catatan: body.catatan ?? null,
      });

    if (insertError) throw insertError;

    return NextResponse.json(
      { success: true, message: "Monitoring berhasil ditambahkan" },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST MONITORING ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
