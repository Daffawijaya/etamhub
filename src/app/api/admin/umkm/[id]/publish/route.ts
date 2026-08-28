import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user || !["admin", "super_admin", "admin_kecamatan"].includes(user.role ?? "")) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const { id } = await context.params;
    const { published } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("umkm")
      .update({
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }

    // Log activity
    await logActivity({
      actorId: user.id,
      actorName: user.nama ?? "Unknown",
      actorRole: user.role ?? "unknown",
      action: published ? "publish_umkm" : "unpublish_umkm",
      targetType: "umkm",
      targetId: id,
      targetName: data?.nama,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Terjadi kesalahan.",
      },
      {
        status: 500,
      },
    );
  }
}
