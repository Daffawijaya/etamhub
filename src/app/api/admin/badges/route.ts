import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({});
  }

  const badges: Record<string, number> = {};

  // Verifikasi badge: count of pending umkm_requests
  if (user.role === "admin_kecamatan" || user.role === "super_admin" || user.role === "admin") {
    const { data: pendingRequests } = await supabaseAdmin
      .from("umkm_requests")
      .select("payload")
      .eq("status", "pending")
      .eq("action", "create");

    if (pendingRequests) {
      if (user.role === "admin_kecamatan" && user.kecamatan.length > 0) {
        // Admin kecamatan: only count requests for their kecamatan
        badges.verifikasi = pendingRequests.filter((req) => {
          const payload = req.payload as Record<string, any>;
          return user.kecamatan.includes(payload?.kecamatan);
        }).length;
      } else {
        // Super admin & admin: all pending
        badges.verifikasi = pendingRequests.length;
      }
    } else {
      badges.verifikasi = 0;
    }
  }

  return NextResponse.json(badges);
}
