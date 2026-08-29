import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logActivity } from "@/lib/activity-log";

// =========================
// PUT — Approve or reject a UMKM creation request
// =========================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const allowedRoles = ["super_admin", "admin_kecamatan", "admin"];
    if (!allowedRoles.includes(user.role ?? "")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { action, reason } = body as {
      action: "approve" | "reject";
      reason?: string;
    };

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "Action harus approve atau reject" },
        { status: 400 },
      );
    }

    // Get request from umkm_requests
    const { data: request, error: findError } = await supabaseAdmin
      .from("umkm_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !request) {
      return NextResponse.json(
        { message: "Request tidak ditemukan" },
        { status: 404 },
      );
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { message: "Request sudah diproses sebelumnya" },
        { status: 400 },
      );
    }

    if (!["create", "edit"].includes(request.action)) {
      return NextResponse.json(
        { message: "Action tidak valid" },
        { status: 400 },
      );
    }

    const payload = request.payload as Record<string, any>;

    // Admin kecamatan hanya bisa approve UMKM di kecamatannya
    if (user.role === "admin_kecamatan") {
      const kecName = payload?.kecamatan;
      if (kecName && user.kecamatan.length > 0) {
        if (!user.kecamatan.includes(kecName)) {
          return NextResponse.json(
            { message: "Tidak memiliki akses ke kecamatan ini" },
            { status: 403 },
          );
        }
      }
    }

    const now = new Date().toISOString();

    if (action === "approve") {
      if (request.action === "create") {
        // CREATE: Insert into umkm table with published: true
        const umkmId = crypto.randomUUID();
        const { error: insertError } = await supabaseAdmin
          .from("umkm")
          .insert({
            id: umkmId,
            ...payload,
            published: true,
            approval_status: "approved",
            approved_by: user.id,
            approved_at: now,
            created_at: now,
            updated_at: now,
          });
        if (insertError) throw insertError;

        // Update user data (email, nik) if provided
        if (payload.email || payload.nik) {
          await supabaseAdmin
            .from("users")
            .update({ email: payload.email, nik: payload.nik, updated_at: now })
            .eq("id", payload.owner_id);
        }

        // Notify owner
        if (payload.owner_id) {
          await supabaseAdmin.from("notifications").insert({
            id: crypto.randomUUID(),
            user_id: payload.owner_id,
            type: "approval",
            title: `UMKM "${payload.nama}" disetujui dan sudah dipublikasikan`,
            link: "/user/umkm",
            created_at: now,
            read: false,
          });
        }

        await logActivity({
          actorId: user.id,
          actorName: user.nama ?? "Unknown",
          actorRole: user.role ?? "unknown",
          action: "approve_umkm",
          targetType: "umkm",
          targetId: umkmId,
          targetName: payload.nama,
          detail: { kecamatan: payload.kecamatan, reason },
        });
      } else if (request.action === "edit") {
        // EDIT: Update existing UMKM record
        const umkmId = request.umkm_id;
        const after = payload.after as Record<string, any>;
        const { email, nik, ...updateData } = after;

        const { error: updateError } = await supabaseAdmin
          .from("umkm")
          .update({ ...updateData, updated_at: now })
          .eq("id", umkmId);
        if (updateError) throw updateError;

        // Update user data (email, nik) if provided
        if (email || nik) {
          await supabaseAdmin
            .from("users")
            .update({ email, nik, updated_at: now })
            .eq("id", request.user_id);
        }

        // Notify owner
        await supabaseAdmin.from("notifications").insert({
          id: crypto.randomUUID(),
          user_id: request.user_id,
          type: "approval",
          title: `Perubahan data UMKM "${after.nama}" disetujui`,
          link: "/user/umkm",
          created_at: now,
          read: false,
        });

        await logActivity({
          actorId: user.id,
          actorName: user.nama ?? "Unknown",
          actorRole: user.role ?? "unknown",
          action: "approve_edit_umkm",
          targetType: "umkm",
          targetId: umkmId,
          targetName: after.nama,
          detail: { reason },
        });
      }
    } else {
      // Reject
      const targetName = request.action === "create"
        ? payload.nama
        : (payload.after as Record<string, any>)?.nama ?? "";
      const kecamatan = request.action === "create"
        ? payload.kecamatan
        : (payload.before as Record<string, any>)?.kecamatan;

      await supabaseAdmin.from("notifications").insert({
        id: crypto.randomUUID(),
        user_id: request.user_id,
        type: "rejection",
        title: `${request.action === "create" ? "UMKM" : "Perubahan data UMKM"} "${targetName}" ditolak${reason ? `: ${reason}` : ""}`,
        link: "/user/umkm",
        created_at: now,
        read: false,
      });

      await logActivity({
        actorId: user.id,
        actorName: user.nama ?? "Unknown",
        actorRole: user.role ?? "unknown",
        action: request.action === "create" ? "reject_umkm" : "reject_edit_umkm",
        targetType: "umkm",
        targetName,
        detail: { kecamatan, reason },
      });
    }

    // Update request status
    const { error: updateError } = await supabaseAdmin
      .from("umkm_requests")
      .update({
        status: action === "approve" ? "approved" : "rejected",
        reviewed_by: user.id,
        reviewed_at: now,
        reason: reason ?? null,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: action === "approve"
        ? "UMKM disetujui dan sudah masuk ke tabel UMKM"
        : "UMKM ditolak",
    });
  } catch (error: any) {
    console.error("PUT VERIFY UMKM ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 },
    );
  }
}
