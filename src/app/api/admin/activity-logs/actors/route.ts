import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const allowedRoles = ["super_admin", "admin", "admin_kecamatan"];
    if (!allowedRoles.includes(user.role ?? "")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let query = supabaseAdmin
      .from("activity_logs")
      .select("actor_id, actor_name, actor_role");

    // Role-based filtering (same as main endpoint)
    if (user.role === "admin_kecamatan") {
      query = query.eq("actor_id", user.id);
    } else if (user.role === "admin") {
      query = query.eq("actor_role", "admin_kecamatan");
    }

    const { data, error } = await query;
    if (error) throw error;

    // Deduplicate by actor_id
    const seen = new Set<string>();
    const actors = (data ?? []).filter((row) => {
      if (seen.has(row.actor_id)) return false;
      seen.add(row.actor_id);
      return true;
    });

    return NextResponse.json({ actors });
  } catch (error: any) {
    console.error("GET ACTIVITY LOGS ACTORS ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
