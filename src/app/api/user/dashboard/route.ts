// app/api/user/dashboard/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
