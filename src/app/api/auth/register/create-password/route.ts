import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, password, confirmPassword } = await req.json();

    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password || !confirmPassword) {
      return NextResponse.json(
        {
          message: "Data wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          message: "Password tidak sama",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message: "Password minimal 8 karakter",
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
      .eq("otp_verified", true)
      .maybeSingle();

    if (pendingError || !pendingUser) {
      return NextResponse.json(
        {
          message: "OTP belum diverifikasi",
        },
        {
          status: 400,
        },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { error: userError } = await supabaseAdmin.from("users").insert({
      nik: pendingUser.nik,
      email: pendingUser.email,
      password: passwordHash,
    });

    if (userError) {
      return NextResponse.json(
        {
          message: userError.message,
        },
        {
          status: 500,
        },
      );
    }

    await supabaseAdmin.from("pending_users").delete().eq("id", pendingUser.id);

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
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
