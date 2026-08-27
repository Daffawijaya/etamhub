import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const isAdminKecamatan = user.role === "admin_kecamatan";
    const kecamatanIds = user.kecamatanIds ?? [];

    // =========================
    // UMKM — filtered by kecamatan for admin kecamatan
    // =========================
    let query = supabaseAdmin.from("umkm").select("*").order("created_at", {
      ascending: false,
    });

    if (isAdminKecamatan && kecamatanIds.length > 0) {
      query = query.in("kecamatan_id", kecamatanIds);
    }

    const { data: umkms, error } = await query;

    if (error) throw error;

    const dataUmkm = umkms ?? [];

    // =========================
    // STATS
    // =========================
    const totalUmkm = dataUmkm.length;

    const kategoriMap = dataUmkm.reduce((acc: any, item) => {
      const kategori = item.kategori || "Lainnya";
      acc[kategori] = (acc[kategori] || 0) + 1;
      return acc;
    }, {});

    const kecamatanMap = dataUmkm.reduce((acc: any, item) => {
      const kecamatan = item.kecamatan || "Tidak diketahui";
      acc[kecamatan] = (acc[kecamatan] || 0) + 1;
      return acc;
    }, {});

    // =========================
    // TOP KECAMATAN — full: admin kecamatan sees ALL their assigned kecamatan
    // even if no UMKM yet (shows 0)
    // =========================
    if (isAdminKecamatan && kecamatanIds.length > 0) {
      const { data: allKec } = await supabaseAdmin
        .from("kecamatan")
        .select("nama")
        .in("id", kecamatanIds);

      for (const kec of allKec ?? []) {
        if (!kecamatanMap[kec.nama]) {
          kecamatanMap[kec.nama] = 0;
        }
      }
    }

    const subkategoriSet = new Set(
      dataUmkm.map((item) => item.subkategori).filter(Boolean),
    );

    // =========================
    // ACTIVITIES — filtered for admin kecamatan
    // =========================
    let notifQuery = supabaseAdmin
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: activities, error: activityError } = await notifQuery;

    if (activityError) throw activityError;

    // =========================
    // CHARTS
    // =========================
    const kategoriChart = Object.entries(kategoriMap).map(([name, value]) => ({
      name,
      value,
    }));

    const kecamatanChart = Object.entries(kecamatanMap).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    return NextResponse.json({
      stats: {
        totalUmkm,
        totalKategori: kategoriChart.length,
        totalKecamatan: kecamatanChart.length,
        totalSubkategori: subkategoriSet.size,
      },

      latest: dataUmkm.slice(0, 5),

      kategoriChart,
      kecamatanChart,
      activities: activities ?? [],
      map: dataUmkm,
    });
  } catch (error: any) {
    console.error("DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
