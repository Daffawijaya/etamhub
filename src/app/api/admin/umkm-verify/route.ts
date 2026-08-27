import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// =========================
// GET — List pending UMKM creation requests for admin kecamatan
// =========================
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch pending create requests from umkm_requests
    let query = supabaseAdmin
      .from("umkm_requests")
      .select("*")
      .eq("action", "create")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    const { data: requests, error } = await query;

    if (error) throw error;

    // Filter by kecamatan for admin kecamatan
    let filtered = requests ?? [];

    if (user.role === "admin_kecamatan" && user.kecamatanIds.length > 0) {
      // Get kecamatan names from IDs
      const { data: kecData } = await supabaseAdmin
        .from("kecamatan")
        .select("id, nama")
        .in("id", user.kecamatanIds);

      const kecNames = new Set((kecData ?? []).map((k) => k.nama));

      filtered = filtered.filter((req) => {
        const payload = req.payload as Record<string, any>;
        return payload?.kecamatan && kecNames.has(payload.kecamatan);
      });
    }

    return NextResponse.json({
      data: filtered,
      total: filtered.length,
    });
  } catch (error: any) {
    console.error("GET VERIFY UMKM ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
