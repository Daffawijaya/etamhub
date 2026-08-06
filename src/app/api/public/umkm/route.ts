import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const kecamatan = searchParams.get("kecamatan");
    const kategori = searchParams.get("kategori");
    const search = searchParams.get("search");

    let query = supabaseAdmin
      .from("umkm")
      .select("*", { count: "exact" })
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

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      data: data ?? [],
      total: count ?? 0,
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
