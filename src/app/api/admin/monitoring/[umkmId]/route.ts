import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    return NextResponse.json({
      umkm,
      monitorings: monitorings ?? [],
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
        kbli: body.kbli ?? null,

        whatsapp: body.whatsapp ?? null,
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
