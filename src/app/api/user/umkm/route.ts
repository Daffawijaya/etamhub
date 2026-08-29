import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  // 1. Cek dulu di umkm_requests (pending request)
  const { data: pendingRequest } = await supabaseAdmin
    .from("umkm_requests")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("action", "create")
    .eq("status", "pending")
    .maybeSingle();

  if (pendingRequest) {
    const payload = pendingRequest.payload as Record<string, any>;

    return NextResponse.json({
      id: null,
      nama: payload?.nama ?? "",
      kategori: payload?.kategori ?? "",
      kecamatan: payload?.kecamatan ?? "",
      alamat: payload?.alamat ?? "",
      gambar: payload?.gambar ?? [],
      halal: payload?.halal ?? null,
      pirt: payload?.pirt ?? null,
      haki: payload?.haki ?? null,
      kbli: payload?.kbli ?? null,
      approval_status: "pending",
      published: false,
      created_at: pendingRequest.created_at,
      rejected_reason: null,
      isPendingRequest: true,
      request_id: pendingRequest.id,
    });
  }

  // 2. Cek di umkm (sudah disetujui)
  const { data, error } = await supabaseAdmin
    .from("umkm")
    .select(
      `
        id,
        nama,
        kategori,
        kecamatan,
        alamat,
        gambar,
        halal,
        pirt,
        haki,
        kbli,
        approval_status,
        published,
        created_at,
        rejected_reason
      `,
    )
    .eq("owner_id", currentUser.id)
    .maybeSingle();

  if (error) {
    console.error("GET /api/user/umkm error:", error);

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }

  // Check for pending edit request
  if (data?.id) {
    const { data: pendingEdit } = await supabaseAdmin
      .from("umkm_requests")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("umkm_id", data.id)
      .eq("action", "edit")
      .eq("status", "pending")
      .maybeSingle();

    if (pendingEdit) {
      return NextResponse.json({
        ...data,
        hasPendingEdit: true,
      });
    }
  }

  return NextResponse.json(data);
}
