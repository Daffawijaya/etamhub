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

    // 1) Ambil actor dari activity_logs
    let logQuery = supabaseAdmin
      .from("activity_logs")
      .select("actor_id, actor_name, actor_role");

    if (user.role === "admin_kecamatan") {
      logQuery = logQuery.eq("actor_id", user.id);
    } else if (user.role === "admin") {
      logQuery = logQuery.eq("actor_role", "admin_kecamatan");
    }

    const { data: logData, error: logError } = await logQuery;
    if (logError) throw logError;

    // 2) Ambil semua admin dari tabel admins (yang role-nya sesuai)
    let adminQuery = supabaseAdmin
      .from("admins")
      .select(`
        id,
        nama,
        roles ( name )
      `);

    if (user.role === "admin") {
      // Admin hanya lihat admin_kecamatan
      const { data: roleData } = await supabaseAdmin
        .from("roles")
        .select("id")
        .eq("name", "admin_kecamatan")
        .maybeSingle();
      if (roleData) {
        adminQuery = adminQuery.eq("role_id", roleData.id);
      }
    }
    // super_admin lihat semua, admin_kecamatan hanya dirinya sendiri
    if (user.role === "admin_kecamatan") {
      adminQuery = adminQuery.eq("id", user.id);
    }

    const { data: adminData } = await adminQuery;

    // 3) Merge: admin dari tabel admins + actor dari activity_logs, deduplicate
    const actorMap = new Map<string, { actor_id: string; actor_name: string; actor_role: string }>();

    // Tambahkan dari admins
    for (const a of adminData ?? []) {
      const roleName = Array.isArray(a.roles) ? (a.roles as any)[0]?.name : (a.roles as any)?.name;
      actorMap.set(a.id, {
        actor_id: a.id,
        actor_name: a.nama,
        actor_role: roleName ?? "admin",
      });
    }

    // Tambahkan dari activity_logs (bisa ada super_admin juga)
    for (const row of logData ?? []) {
      if (!actorMap.has(row.actor_id)) {
        actorMap.set(row.actor_id, {
          actor_id: row.actor_id,
          actor_name: row.actor_name,
          actor_role: row.actor_role,
        });
      }
    }

    const actors = Array.from(actorMap.values());

    return NextResponse.json({ actors });
  } catch (error: any) {
    console.error("GET ACTIVITY LOGS ACTORS ERROR:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
