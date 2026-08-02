import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_URL}/reset-password`,
      },
    );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Link reset password berhasil dikirim.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengirim reset password",
      },
      {
        status: 500,
      },
    );
  }
}
