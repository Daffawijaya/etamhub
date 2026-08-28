import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import { logActivity } from "@/lib/activity-log";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { published } = await req.json();

    const { error } = await supabaseAdmin
      .from("news")
      .update({
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw error;
    }

    // Log activity
    const user = await getCurrentUser();
    if (user) {
      const { data: newsData } = await supabaseAdmin
        .from("news")
        .select("title")
        .eq("id", id)
        .single();

      await logActivity({
        actorId: user.id,
        actorName: user.nama ?? "Unknown",
        actorRole: user.role ?? "unknown",
        action: published ? "publish_berita" : "unpublish_berita",
        targetType: "berita",
        targetId: id,
        targetName: newsData?.title,
      });
    }

    return NextResponse.json({
      success: true,
      published,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal mengubah status berita",
      },
      {
        status: 500,
      },
    );
  }
}
