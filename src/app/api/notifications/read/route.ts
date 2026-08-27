import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: true });
    }

    let query = supabaseAdmin
      .from("notifications")
      .update({ read: true })
      .eq("read", false);

    if (user.role === "user_umkm") {
      query = query.eq("user_id", user.id);
    } else {
      query = query.eq("admin_id", user.id);
    }

    const { error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 },
    );
  }
}
