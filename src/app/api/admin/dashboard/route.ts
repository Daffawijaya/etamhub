import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data: umkms, error } = await supabaseAdmin
      .from("umkm")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    const totalUmkm = umkms.length;

    const kategoriMap = umkms.reduce((acc: any, item) => {
      acc[item.kategori] = (acc[item.kategori] || 0) + 1;
      return acc;
    }, {});

    const { data: activities, error: activityError } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

    if (activityError) throw activityError;
    const kecamatanMap = umkms.reduce((acc: any, item) => {
      acc[item.kecamatan] = (acc[item.kecamatan] || 0) + 1;
      return acc;
    }, {});

    const subkategoriSet = new Set(
      umkms.map((item) => item.subkategori).filter(Boolean),
    );

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

    const latest = umkms.slice(0, 5);

    return NextResponse.json({
      stats: {
        totalUmkm,
        totalKategori: kategoriChart.length,
        totalKecamatan: kecamatanChart.length,
        totalSubkategori: subkategoriSet.size,
      },

      latest,

      kategoriChart,

      kecamatanChart,
      activities,
      map: umkms,
    });
  } catch (error: any) {
    console.error(error);

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
