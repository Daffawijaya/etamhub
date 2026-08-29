import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import { calculateBadgeWithCriteria, getBadgeCriteria } from "@/lib/monitoring/badges";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  // 1. Cek dulu di umkm_requests (pending request)
  const { data: pendingRequest } = await supabaseAdmin
    .from("umkm_requests")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("action", "create")
    .eq("status", "pending")
    .maybeSingle();

  if (pendingRequest) {
    const payload = pendingRequest.payload as Record<string, any>;

    return NextResponse.json({
      id: null,
      nama: payload?.nama ?? "",
      kategori: payload?.kategori ?? "",
      kecamatan: payload?.kecamatan ?? "",
      alamat: payload?.alamat ?? "",
      gambar: payload?.gambar ?? [],
      halal: payload?.halal ?? null,
      pirt: payload?.pirt ?? null,
      haki: payload?.haki ?? null,
      kbli: payload?.kbli ?? null,
      approval_status: "pending",
      published: false,
      created_at: pendingRequest.created_at,
      rejected_reason: null,
      isPendingRequest: true,
      request_id: pendingRequest.id,
    });
  }

  // 2. Cek di umkm (sudah disetujui)
  const { data, error } = await supabaseAdmin
    .from("umkm")
    .select(
      `
        id,
        nama,
        kategori,
        kecamatan,
        alamat,
        gambar,
        omzet,
        halal,
        pirt,
        haki,
        kbli,
        approval_status,
        published,
        created_at,
        rejected_reason
      `,
    )
    .eq("owner_id", currentUser.id)
    .maybeSingle();

  if (error) {
    console.error("GET /api/user/umkm error:", error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }

  // Check for pending edit request
  if (data?.id) {
    const { data: pendingEdit } = await supabaseAdmin
      .from("umkm_requests")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("umkm_id", data.id)
      .eq("action", "edit")
      .eq("status", "pending")
      .maybeSingle();

    // Fetch monitoring + badge
    const { data: monitorings } = await supabaseAdmin
      .from("umkm_monitoring")
      .select("id, jumlah_tenaga_kerja, omzet, halal, pirt, haki, nib, kbli, instagram, facebook, tiktok")
      .eq("umkm_id", data.id)
      .order("created_at", { ascending: false });

    const monitoringCount = (monitorings ?? []).length;
    const latest = monitorings?.[0] ?? null;

    const mergedLatest = latest
      ? {
          omzet: latest.omzet ?? data.omzet ?? null,
          jumlah_tenaga_kerja: latest.jumlah_tenaga_kerja ?? null,
          nib: latest.nib ?? null,
          halal: latest.halal ?? data.halal ?? null,
          pirt: latest.pirt ?? data.pirt ?? null,
          haki: latest.haki ?? data.haki ?? null,
          kbli: latest.kbli ?? data.kbli ?? null,
          instagram: latest.instagram ?? null,
          facebook: latest.facebook ?? null,
          tiktok: latest.tiktok ?? null,
        }
      : {
          omzet: data.omzet ?? null,
          jumlah_tenaga_kerja: null,
          nib: null,
          halal: data.halal ?? null,
          pirt: data.pirt ?? null,
          haki: data.haki ?? null,
          kbli: data.kbli ?? null,
          instagram: null,
          facebook: null,
          tiktok: null,
        };

    const badgeConfig = await getBadgeCriteria();
    const badge = calculateBadgeWithCriteria(mergedLatest, mergedLatest, monitoringCount, badgeConfig);

    const result: Record<string, any> = {
      ...data,
      hasPendingEdit: !!pendingEdit,
      badge: {
        level: badge.level,
        label: badge.label,
        color: badge.color,
        bgColor: badge.bgColor,
      },
      monitoringCount,
    };

    return NextResponse.json(result);
  }

  return NextResponse.json(data);
}
