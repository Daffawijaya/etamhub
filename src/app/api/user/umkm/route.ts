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
    .from("umkm")
    .select(
      `
      id,
      nama,
      kategori,
      kecamatan,
      alamat,
      gambar,
      approval_status,
      published,
      created_at,
      rejected_reason
    `,
    )
    .eq("owner_id", currentUser.id)
    .maybeSingle();

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
