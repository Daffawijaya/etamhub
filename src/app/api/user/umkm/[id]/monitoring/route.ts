import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";

// GET — Monitoring history for user's own UMKM
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Verify UMKM belongs to this user
    const { data: umkm, error: umkmError } = await supabaseAdmin
      .from("umkm")
      .select("id")
      .eq("id", id)
      .eq("owner_id", user.id)
      .single();

    if (umkmError || !umkm) {
      return NextResponse.json(
        { message: "UMKM tidak ditemukan" },
        { status: 404 },
      );
    }

    // Get monitoring history
    const { data: monitorings, error: monError } = await supabaseAdmin
      .from("umkm_monitoring")
      .select(
        "id, created_at, jumlah_tenaga_kerja, omzet, halal, pirt, haki, nib, kbli, instagram, facebook, tiktok, kebutuhan_utama, catatan",
      )
      .eq("umkm_id", id)
      .order("created_at", { ascending: false });

    if (monError) throw monError;

    return NextResponse.json({
      monitorings: monitorings ?? [],
      totalMonitoring: (monitorings ?? []).length,
    });
  } catch (error: any) {
    console.error("GET USER MONITORING ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
