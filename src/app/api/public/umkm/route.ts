import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { attachBadges, byBadgeThenName } from "@/lib/monitoring/badges";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kecamatan = searchParams.get("kecamatan");
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("umkm")
      .select("*")
      .eq("published", true)

    if (kecamatan) {
      query = query.eq("kecamatan", kecamatan);
    }

    if (kategori) {
      query = query.eq("kategori", kategori);
    }

    if (search) {
      query = query.ilike("nama", `%${search}%`);
    }

    query = query.order("created_at", {
      ascending: false,
    });

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 12);

    // Tanpa range: ambil semua, hitung badge, urut global, baru potong per halaman.
    // (Sort client per halaman bikin badge halaman 2 kalah dengan non-badge halaman 1.)
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const umkms = data ?? [];

    // Badge dihitung terpusat (termasuk level "none") — sama seperti admin & SSR.
    const withBadges = await attachBadges(umkms);
    withBadges.sort(byBadgeThenName);

    const from = (page - 1) * limit;

    return NextResponse.json({
      data: withBadges.slice(from, from + limit),
      total: withBadges.length,
      page,
      limit,
    });
  } catch (error: any) {
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
