import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const limit = Math.min(Number(searchParams.get("limit") || 50), 200);

    let query = supabaseAdmin
      .from("kbli")
      .select("kode, nama_id, nama_en")
      .order("kode", { ascending: true })
      .limit(limit);

    if (search.trim()) {
      const keyword = search.trim();
      query = query.or(
        `kode.ilike.%${keyword}%,nama_id.ilike.%${keyword}%`,
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error: any) {
    console.error("GET KBLI ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
