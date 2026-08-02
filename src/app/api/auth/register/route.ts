import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { nik, email, password } = await req.json();

    if (!nik || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "NIK, email, dan password wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    if (!/^\d{16}$/.test(nik)) {
      return NextResponse.json(
        {
          success: false,
          message: "NIK harus terdiri dari 16 digit",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: "Email harus menggunakan akun @gmail.com",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password minimal 6 karakter",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingNik, error: nikError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("nik", nik)
      .maybeSingle();

    if (nikError) {
      console.error(nikError);

      return NextResponse.json(
        {
          success: false,
          message: nikError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (existingNik) {
      return NextResponse.json(
        {
          success: false,
          message: "NIK sudah terdaftar",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingEmail, error: emailError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (emailError) {
      console.error(emailError);

      return NextResponse.json(
        {
          success: false,
          message: emailError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (existingEmail) {
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

    await supabaseAdmin
      .from("pending_users")
      .delete()
      .eq("email", normalizedEmail);

    const { error: pendingError } = await supabaseAdmin
      .from("pending_users")
      .insert({
        nik,
        email: normalizedEmail,
        password,
      });

    if (pendingError) {
      console.error(pendingError);

      return NextResponse.json(
        {
          success: false,
          message: pendingError.message,
        },
        {
          status: 500,
        },
      );
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
    });

    if (otpError) {
      console.error(otpError);

      return NextResponse.json(
        {
          success: false,
          message: otpError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kode OTP telah dikirim ke email Anda.",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Registrasi gagal",
      },
      {
        status: 500,
      },
    );
  }
}
