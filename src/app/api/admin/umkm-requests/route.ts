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

  const { data: requests, error } = await supabaseAdmin
    .from("umkm_requests")
    .select(
      `
      *,
      umkm:umkm_id (
        id,
        nama,
        kategori,
        kecamatan,
        gambar
      )
      `,
    )
    .order("created_at", {
      ascending: false,
    });

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

  const userIds = [
    ...new Set((requests ?? []).map((item) => item.user_id).filter(Boolean)),
  ];

  const adminIds = [
    ...new Set(
      (requests ?? []).map((item) => item.reviewed_by).filter(Boolean),
    ),
  ];

  const { data: users } =
    userIds.length > 0
      ? await supabaseAdmin
          .from("users")
          .select("id, email, nik")
          .in("id", userIds)
      : { data: [] };

  const { data: admins } =
    adminIds.length > 0
      ? await supabaseAdmin
          .from("admins")
          .select("id, nama, username")
          .in("id", adminIds)
      : { data: [] };

  const result = (requests ?? []).map((request) => ({
    ...request,
    creator: users?.find((user) => user.id === request.user_id) ?? null,
    reviewer: admins?.find((admin) => admin.id === request.reviewed_by) ?? null,
  }));

  return NextResponse.json(result);
}
