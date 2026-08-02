import crypto from "crypto";
import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email dan OTP wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const { error: otpError } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: otp,
      type: "email",
    });

    if (otpError) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP tidak valid atau sudah kedaluwarsa",
        },
        {
          status: 400,
        },
      );
    }

    const { data: pendingUser, error: pendingError } = await supabaseAdmin
      .from("pending_users")
      .select("*")
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

    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (existingUserError) {
      throw existingUserError;
    }

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar",
        },
        {
          status: 400,
        },
      );
    }

    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: crypto.randomUUID(),
      nik: pendingUser.nik,
      email: pendingUser.email,
      password: pendingUser.password,
      provider: "manual",
      is_active: true,
    });

    if (insertError) {
      throw insertError;
    }

    const { error: deleteError } = await supabaseAdmin
      .from("pending_users")
      .delete()
      .eq("email", normalizedEmail);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Email berhasil diverifikasi",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Verifikasi OTP gagal",
      },
      {
        status: 500,
      },
    );
  }
}
