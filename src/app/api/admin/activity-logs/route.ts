import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["super_admin", "admin", "admin_kecamatan"];
    if (!allowedRoles.includes(user.role ?? "")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const action = searchParams.get("action");
    const actorId = searchParams.get("actor_id");
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from("activity_logs")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) {
      query = query.eq("action", action);
    }

    if (actorId) {
      query = query.eq("actor_id", actorId);
    }

    // Role-based filtering:
    // - super_admin: lihat semua log
    // - admin: hanya lihat log admin_kecamatan
    // - admin_kecamatan: hanya lihat log sendiri
    if (user.role === "admin_kecamatan") {
      query = query.eq("actor_id", user.id);
    } else if (user.role === "admin") {
      query = query.eq("actor_role", "admin_kecamatan");
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      logs: data,
      total: count,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0,
    });
  } catch (error: any) {
    console.error("GET ACTIVITY LOGS ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
