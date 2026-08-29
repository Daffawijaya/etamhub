import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateBadge, getBadgeCriteria } from "@/lib/monitoring/badges";
import { logActivity } from "@/lib/activity-log";

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
      nib: umkm.nib ?? null,
      instagram: umkm.instagram ?? null,
      facebook: umkm.facebook ?? null,
      tiktok: umkm.tiktok ?? null,
    };

    // Build latest monitoring data — merge with UMKM data as fallback
    const latestEntry = (monitorings ?? [])[0] ?? null;
    const latest = latestEntry
      ? {
          omzet: latestEntry.omzet ?? null,
          jumlah_tenaga_kerja: latestEntry.jumlah_tenaga_kerja ?? null,
          halal: latestEntry.halal ?? initial.halal,
          pirt: latestEntry.pirt ?? initial.pirt,
          haki: latestEntry.haki ?? initial.haki,
          nib: latestEntry.nib ?? initial.nib,
          instagram: latestEntry.instagram ?? initial.instagram,
          facebook: latestEntry.facebook ?? initial.facebook,
          tiktok: latestEntry.tiktok ?? initial.tiktok,
        }
      : initial;

    const badge = await calculateBadge(initial, latest, (monitorings ?? []).length);
    const criteriaConfig = await getBadgeCriteria();

    return NextResponse.json({
      umkm,
      monitorings: monitorings ?? [],
      badge,
      criteriaConfig,
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

    // Get UMKM name for logging
    const { data: umkmData } = await supabaseAdmin
      .from("umkm")
      .select("nama")
      .eq("id", umkmId)
      .single();

    await logActivity({
      actorId: user.id,
      actorName: user.nama ?? "Unknown",
      actorRole: user.role ?? "unknown",
      action: "add_monitoring",
      targetType: "umkm",
      targetId: umkmId,
      targetName: umkmData?.nama,
      detail: {
        omzet: body.omzet,
        jumlah_tenaga_kerja: body.jumlah_tenaga_kerja,
        catatan: body.catatan,
      },
    });

    // Notify admin & super_admin when admin_kecamatan adds monitoring
    if (user.role === "admin_kecamatan") {
      const { data: admins } = await supabaseAdmin
        .from("admins")
        .select("id, roles ( name )");

      const adminIds = (admins ?? [])
        .filter((a: any) => {
          const roleName = Array.isArray(a.roles) ? a.roles[0]?.name : (a.roles as any)?.name;
          return roleName === "admin" || roleName === "super_admin";
        })
        .map((a: any) => a.id);

      if (adminIds.length > 0) {
        const notifications = adminIds.map((adminId: string) => ({
          id: crypto.randomUUID(),
          admin_id: adminId,
          type: "monitoring",
          title: `${user.nama} menambah monitoring UMKM "${umkmData?.nama}"`,
          link: `/admin/monitoring/${umkmId}`,
          created_at: now,
          read: false,
        }));

        await supabaseAdmin.from("notifications").insert(notifications);
      }
    }

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
