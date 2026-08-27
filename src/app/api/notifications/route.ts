import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json([], { status: 200 });
  }

  let query = supabaseAdmin
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // Filter by the correct user identifier
  if (user.role === "user_umkm") {
    query = query.eq("user_id", user.id);
  } else {
    // admin, admin_kecamatan, super_admin — match on admin_id
    query = query.eq("admin_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("NOTIFICATION ERROR:", error);

    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}
