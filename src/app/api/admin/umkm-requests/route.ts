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

  const { data, error } = await supabaseAdmin
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
    ),
  creator:user_id (
  id,
  email,
  nik
)
 reviewer:reviewed_by (
  id,
  email,
  nik
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

  return NextResponse.json(data);
}
