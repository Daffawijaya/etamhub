import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    const { count, error } = await supabaseAdmin
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("admin_id", user.id)
      .eq("read", false);

    if (error) throw error;

    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
