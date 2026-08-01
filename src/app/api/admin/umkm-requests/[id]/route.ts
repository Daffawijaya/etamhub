import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { action } = body;

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json(
      { message: "Action tidak valid" },
      { status: 400 },
    );
  }

  const { data: request, error: requestError } = await supabaseAdmin
    .from("umkm_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (requestError || !request) {
    return NextResponse.json(
      { message: "Request tidak ditemukan" },
      { status: 404 },
    );
  }

  if (request.status !== "pending") {
    return NextResponse.json(
      { message: "Request sudah diproses" },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  // =========================
  // REJECT
  // =========================

  if (action === "reject") {
    await supabaseAdmin
      .from("umkm")
      .update({
        approval_status: "rejected",
        updated_at: now,
      })
      .eq("id", request.umkm_id);

    await supabaseAdmin
      .from("umkm_requests")
      .update({
        status: "rejected",
        reviewed_by: currentUser.id,
        reviewed_at: now,
        reason: body.reason ?? null,
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      message: "Request ditolak",
    });
  }

  // =========================
  // APPROVE UPDATE
  // =========================

  if (request.action === "update") {
    const payload = request.payload;

    const { email, nik, ...umkmData } = payload;

    const { error: updateError } = await supabaseAdmin
      .from("umkm")
      .update({
        ...umkmData,
        approval_status: "approved",
        updated_at: now,
      })
      .eq("id", request.umkm_id);

    if (updateError) {
      return NextResponse.json(
        { message: updateError.message },
        { status: 500 },
      );
    }

    if (email || nik) {
      const { data: umkm } = await supabaseAdmin
        .from("umkm")
        .select("owner_id")
        .eq("id", request.umkm_id)
        .single();

      if (umkm?.owner_id) {
        await supabaseAdmin
          .from("users")
          .update({
            email,
            nik,
            updated_at: now,
          })
          .eq("id", umkm.owner_id);
      }
    }
  }

  // =========================
  // APPROVE DELETE
  // =========================

  if (request.action === "delete") {
    const { error: deleteError } = await supabaseAdmin
      .from("umkm")
      .delete()
      .eq("id", request.umkm_id);

    if (deleteError) {
      return NextResponse.json(
        { message: deleteError.message },
        { status: 500 },
      );
    }
  }

  await supabaseAdmin
    .from("umkm_requests")
    .update({
      status: "approved",
      reviewed_by: currentUser.id,
      reviewed_at: now,
    })
    .eq("id", id);

  await supabaseAdmin.from("notifications").insert({
    id: crypto.randomUUID(),
    type: "request",
    title: `Request UMKM ${request.action} disetujui`,
    created_at: now,
    read: false,
  });

  return NextResponse.json({
    success: true,
    message: "Request berhasil disetujui",
  });
}
