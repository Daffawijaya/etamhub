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

    let query = supabaseAdmin.from("umkm").select("*").order("created_at", {
      ascending: false,
    });

    // ADMIN KECAMATAN FILTER DATA
    if (user.role === "admin_kecamatan" && user.kecamatanIds.length > 0) {
      query = query.in("kecamatan_id", user.kecamatanIds);
    }

    const { data: umkms, error } = await query;

    if (error) throw error;

    const dataUmkm = umkms ?? [];

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

    const subkategoriSet = new Set(
      dataUmkm.map((item) => item.subkategori).filter(Boolean),
    );

    const { data: activities, error: activityError } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (activityError) throw activityError;

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
