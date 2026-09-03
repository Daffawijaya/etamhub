import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";
import { checkPermission, forbiddenResponse } from "@/lib/permissions";
import { logActivity } from "@/lib/activity-log";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check delete permission
    const canDelete = await checkPermission(user, "canDelete");
    if (!canDelete) {
      return forbiddenResponse("Anda tidak memiliki izin untuk menghapus data");
    }

    const { id } = await params;

    const { error } = await supabaseAdmin.from("news").delete().eq("id", id);

    if (error) {
      throw error;
    }

    // Log activity
    await logActivity({
      actorId: user.id,
      actorName: user.nama ?? "Unknown",
      actorRole: user.role ?? "unknown",
      action: "delete_berita",
      targetType: "berita",
      targetId: id,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Gagal menghapus berita",
      },
      {
        status: 500,
      },
    );
  }
}
