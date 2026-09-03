import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ALLOWED_ROLES = ["admin", "admin_kecamatan"] as const;

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !ALLOWED_ROLES.includes(user.role as any)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("role_permissions")
      .select("*")
      .in("role", [...ALLOWED_ROLES])
      .order("role");

    if (error) throw error;

    const mapped = (data ?? []).map((r: any) => ({
      role: r.role,
      canCreate: r.can_create,
      canRead: r.can_read,
      canUpdate: r.can_update,
      canDelete: r.can_delete,
    }));

    return NextResponse.json(mapped);
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
