import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    const { data: user, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        id: crypto.randomUUID(),
        nik,
        email: normalizedEmail,
        password,
        provider: "manual",
        is_active: true,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error(insertError);

      return NextResponse.json(
        {
          success: false,
          message: insertError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      user_id: user.id,
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
