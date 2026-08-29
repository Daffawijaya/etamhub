// app/api/user/dashboard/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { calculateBadgeWithCriteria, getBadgeCriteria, BADGE_STYLES } from "@/lib/monitoring/badges";

function calculateCompleteness(umkm: any) {
  const fields = [
    "nama",
    "pemilik",
    "kategori",
    "subkategori",
    "deskripsi",
    "kecamatan",
    "alamat",
    "whatsapp",
    "gambar",
    "nib",
    "kbli",
  ];

  const filled = fields.filter((field) => {
    const value = umkm?.[field];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined && value !== "";
  }).length;

  return {
    percentage: Math.round((filled / fields.length) * 100),
    filled,
    total: fields.length,
  };
}

function getStatusLabel(status: string | null) {
  switch (status) {
    case "approved":
      return "Disetujui";

    case "rejected":
      return "Ditolak";

    case "revision":
      return "Perlu Perbaikan";

    case "pending":
      return "Menunggu Verifikasi";

    default:
      return "Belum Ada";
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select(
        `
            id,
            nik,
            email,
            role
          `,
      )
      .eq("id", userId)
      .single();

    if (profileError) {
      return NextResponse.json(
        {
          message: profileError.message,
        },
        {
          status: 400,
        },
      );
    }

    const { data: umkm, error: umkmError } = await supabaseAdmin
      .from("umkm")
      .select(
        `
            id,
            nama,
            pemilik,
            kategori,
            subkategori,
            deskripsi,
            kecamatan,
            alamat,
            whatsapp,
            omzet,
            jumlah_tenaga_kerja,
            instagram,
            facebook,
            tiktok,
            gambar,
            nib,
            npwp,
            halal,
            pirt,
            haki,
            kbli,
            approval_status,
            published,
            created_at,
            updated_at
          `,
      )
      .eq("owner_id", userId)
      .maybeSingle();

    if (umkmError) {
      return NextResponse.json(
        {
          message: umkmError.message,
        },
        {
          status: 400,
        },
      );
    }

    if (!umkm) {
      return NextResponse.json({
        profile,

        umkm: null,

        status: {
          approval_status: null,
          approval_label: "Belum Ada",
          published: false,
        },

        completeness: {
          percentage: 0,
          filled: 0,
          total: 11,
        },

        legalitas: {
          nib: false,
          npwp: false,
          halal: false,
          pirt: false,
          haki: false,
          kbli: false,
        },

        badge: {
          level: "none",
          label: "",
          color: BADGE_STYLES.none.color,
          bgColor: BADGE_STYLES.none.bgColor,
          description: "Belum ada UMKM",
        },

        monitoring: {
          count: 0,
          lastDate: null,
          latestData: null,
        },

        timeline: [],
      });
    }

    const { data: requests, error: requestError } = await supabaseAdmin
      .from("umkm_requests")
      .select(
        `
            id,
            action,
            status,
            created_at,
            reviewed_at,
            reason
          `,
      )
      .eq("umkm_id", umkm.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (requestError) {
      return NextResponse.json(
        {
          message: requestError.message,
        },
        {
          status: 400,
        },
      );
    }

    const timeline = [
      {
        title: "Data UMKM dibuat",
        date: umkm.created_at,
        status: "done",
      },

      ...(requests ?? []).map((item) => ({
        title:
          item.status === "approved"
            ? "Pengajuan disetujui"
            : item.status === "rejected"
              ? "Pengajuan ditolak"
              : item.status === "revision"
                ? "Perlu perbaikan data"
                : "Menunggu verifikasi admin",

        date: item.created_at,

        status:
          item.status === "approved"
            ? "done"
            : item.status === "pending"
              ? "current"
              : item.status,

        reason: item.reason,
      })),
    ];

    // Check for pending edit request
    const { data: pendingEdit } = await supabaseAdmin
      .from("umkm_requests")
      .select("id")
      .eq("user_id", userId)
      .eq("umkm_id", umkm.id)
      .eq("action", "edit")
      .eq("status", "pending")
      .maybeSingle();

    // Fetch monitoring data + calculate badge
    const { data: monitorings } = await supabaseAdmin
      .from("umkm_monitoring")
      .select("id, created_at, jumlah_tenaga_kerja, omzet, halal, pirt, haki, nib, kbli, instagram, facebook, tiktok")
      .eq("umkm_id", umkm.id)
      .order("created_at", { ascending: false });

    const monitoringCount = (monitorings ?? []).length;
    const latestMonitoring = monitorings?.[0] ?? null;

    // Build merged latest data (monitoring + umkm base)
    const mergedLatest = latestMonitoring
      ? {
          omzet: latestMonitoring.omzet ?? umkm.omzet,
          jumlah_tenaga_kerja: latestMonitoring.jumlah_tenaga_kerja ?? umkm.jumlah_tenaga_kerja,
          nib: latestMonitoring.nib ?? umkm.nib,
          halal: latestMonitoring.halal ?? umkm.halal,
          pirt: latestMonitoring.pirt ?? umkm.pirt,
          haki: latestMonitoring.haki ?? umkm.haki,
          kbli: latestMonitoring.kbli ?? umkm.kbli,
          instagram: latestMonitoring.instagram ?? umkm.instagram,
          facebook: latestMonitoring.facebook ?? umkm.facebook,
          tiktok: latestMonitoring.tiktok ?? umkm.tiktok,
        }
      : {
          omzet: umkm.omzet,
          jumlah_tenaga_kerja: umkm.jumlah_tenaga_kerja,
          nib: umkm.nib,
          halal: umkm.halal,
          pirt: umkm.pirt,
          haki: umkm.haki,
          kbli: umkm.kbli,
          instagram: umkm.instagram,
          facebook: umkm.facebook,
          tiktok: umkm.tiktok,
        };

    const badgeConfig = await getBadgeCriteria();
    const initialData = {
      omzet: null,
      jumlah_tenaga_kerja: null,
      nib: null,
      halal: null,
      pirt: null,
      haki: null,
      kbli: null,
      instagram: null,
      facebook: null,
      tiktok: null,
    };
    const badge = calculateBadgeWithCriteria(initialData, mergedLatest, monitoringCount, badgeConfig);

    // Monitoring summary for dashboard
    const monitoringSummary = {
      count: monitoringCount,
      lastDate: latestMonitoring?.created_at ?? null,
      latestData: latestMonitoring
        ? {
            omzet: latestMonitoring.omzet,
            jumlah_tenaga_kerja: latestMonitoring.jumlah_tenaga_kerja,
            nib: latestMonitoring.nib,
            halal: latestMonitoring.halal,
            pirt: latestMonitoring.pirt,
            haki: latestMonitoring.haki,
            instagram: latestMonitoring.instagram,
            facebook: latestMonitoring.facebook,
            tiktok: latestMonitoring.tiktok,
          }
        : null,
    };

    return NextResponse.json({
      profile,

      umkm: {
        id: umkm.id,
        nama: umkm.nama,
        pemilik: umkm.pemilik,
        kategori: umkm.kategori,
        subkategori: umkm.subkategori,
        deskripsi: umkm.deskripsi,
        kecamatan: umkm.kecamatan,
        alamat: umkm.alamat,
        whatsapp: umkm.whatsapp,
        instagram: umkm.instagram,
        facebook: umkm.facebook,
        tiktok: umkm.tiktok,
        gambar_count: Array.isArray(umkm.gambar) ? umkm.gambar.length : 0,
      },

      status: {
        approval_status: umkm.approval_status,
        approval_label: getStatusLabel(umkm.approval_status),
        published: umkm.published,
        hasPendingEdit: !!pendingEdit,
      },

      completeness: calculateCompleteness(umkm),

      legalitas: {
        nib: Boolean(umkm.nib),
        npwp: Boolean(umkm.npwp),
        halal: Boolean(umkm.halal),
        pirt: Boolean(umkm.pirt),
        haki: Boolean(umkm.haki),
        kbli: Array.isArray(umkm.kbli) && umkm.kbli.length > 0,
      },

      badge: {
        level: badge.level,
        label: badge.label,
        color: badge.color,
        bgColor: badge.bgColor,
        description: badge.description,
      },

      monitoring: monitoringSummary,

      timeline,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Terjadi kesalahan server",
      },
      {
        status: 500,
      },
    );
  }
}
