import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email tidak valid",
        },
        {
          status: 400,
        },
      );
    }

    const { data: pendingUser, error: pendingError } = await supabaseAdmin
      .from("pending_users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (pendingError) {
      throw pendingError;
    }

    if (!pendingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Data registrasi tidak ditemukan",
        },
        {
          status: 404,
        },
      );
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
    });

    if (otpError) {
      throw otpError;
    }

    return NextResponse.json({
      success: true,
      message: "Kode OTP berhasil dikirim ulang.",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Gagal mengirim ulang OTP",
      },
      {
        status: 500,
      },
    );
  }
}
