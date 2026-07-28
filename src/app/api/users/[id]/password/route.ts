import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await params;

    console.log("RESET PASSWORD USER ID:", id);

    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        {
          message: "Password wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    if (!id) {
      return NextResponse.json(
        {
          message: "ID user tidak ditemukan",
        },
        {
          status: 400,
        },
      );
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({
        password,
      })
      .eq("id", id);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
