import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, token } = await req.json();

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !token) {
      return NextResponse.json(
        {
          message: "Email dan OTP wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    // Verifikasi OTP Supabase Auth
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: "email",
    });

    if (error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          message: "User OTP tidak ditemukan",
        },
        {
          status: 400,
        },
      );
    }

    // Update pending user
    const { error: updateError } = await supabaseAdmin
      .from("pending_users")
      .update({
        otp_verified: true,
        status: "verified",
      })
      .eq("email", normalizedEmail);

    if (updateError) {
      return NextResponse.json(
        {
          message: updateError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP berhasil diverifikasi",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Terjadi kesalahan server",
      },
      {
        status: 500,
      },
    );
  }
}
