import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { nik, email } = await req.json();

    const normalizedEmail = email?.trim().toLowerCase();

    if (!nik || nik.length !== 16) {
      return NextResponse.json(
        {
          message: "NIK harus 16 digit",
        },
        {
          status: 400,
        },
      );
    }

    if (!normalizedEmail) {
      return NextResponse.json(
        {
          message: "Email wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    // Cek NIK sudah ada
    const { data: existingNik } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("nik", nik)
      .maybeSingle();

    if (existingNik) {
      return NextResponse.json(
        {
          message: "NIK sudah terdaftar",
        },
        {
          status: 400,
        },
      );
    }

    // Cek email sudah ada
    const { data: existingEmail } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        {
          message: "Email sudah terdaftar",
        },
        {
          status: 400,
        },
      );
    }

    // Simpan pending register
    const { error: pendingError } = await supabaseAdmin
      .from("pending_users")
      .upsert(
        {
          nik,
          email: normalizedEmail,
          status: "pending",
          otp_verified: false,
        },
        {
          onConflict: "email",
        },
      );

    if (pendingError) {
      return NextResponse.json(
        {
          message: pendingError.message,
        },
        {
          status: 500,
        },
      );
    }

    // Kirim OTP melalui Supabase Auth + Resend
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (otpError) {
      console.error("OTP ERROR:", JSON.stringify(otpError, null, 2));
      console.dir(otpError, { depth: null });
      return NextResponse.json(
        {
          message: otpError.message,
          error: otpError,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP berhasil dikirim",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    console.dir(error, { depth: null });
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
