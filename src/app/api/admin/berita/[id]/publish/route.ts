import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
