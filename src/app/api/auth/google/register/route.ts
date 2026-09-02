import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { nik, password } = await req.json();

    if (!nik || nik.length !== 16) {
      return NextResponse.json(
        {
          success: false,
          message: "NIK harus terdiri dari 16 digit.",
        },
        {
          status: 400,
        },
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password minimal 6 karakter.",
        },
        {
          status: 400,
        },
      );
    }

    const cookieStore = await cookies();

    const googleRegister = cookieStore.get("google_register");

    if (!googleRegister) {
      return NextResponse.json(
        {
          success: false,
          message: "Sesi Google telah berakhir. Silakan login kembali.",
        },
        {
          status: 401,
        },
      );
    }

    const { email } = JSON.parse(googleRegister.value) as {
      email: string;
    };

    // =========================
    // CEK EMAIL
    // =========================
    const { data: emailExists, error: emailError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailError) {
      throw emailError;
    }

    if (emailExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar.",
        },
        {
          status: 409,
        },
      );
    }

    // =========================
    // CEK NIK
    // =========================
    const { data: nikExists, error: nikError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("nik", nik)
      .maybeSingle();

    if (nikError) {
      throw nikError;
    }

    if (nikExists) {
      return NextResponse.json(
        {
          success: false,
          message: "NIK sudah terdaftar.",
        },
        {
          status: 409,
        },
      );
    }

    // =========================
    // HASH PASSWORD
    // =========================
    const passwordHash = await bcrypt.hash(password, 12);

    // =========================
    // INSERT USER
    // =========================
    const { data: user, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        nik,
        email,
        password: passwordHash,
      })
      .select("id,email")
      .single();

    if (insertError) {
      throw insertError;
    }

    // Auto-konek UMKM orphan via NIK (1 NIK = 1 UMKM)
    const now = new Date().toISOString();
    const { data: claimed } = await supabaseAdmin
      .from("umkm")
      .update({ owner_id: user.id, updated_at: now })
      .eq("nik", nik)
      .is("owner_id", null)
      .select("id,nama");
    if (claimed && claimed.length > 0) {
      await supabaseAdmin.from("notifications").insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        type: "approval",
        title: `UMKM "${claimed[0].nama}" otomatis terhubung ke akun kamu`,
        link: "/user/umkm",
        created_at: now,
        read: false,
      });
    }

    // =========================
    // LOGIN OTOMATIS
    // =========================
    const token = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({
      success: true,
      role: "user_umkm",
      user: {
        id: user.id,
        nama: user.email,
      },
    });

    const maxAge = 60 * 60 * 24;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge,
    };

    response.cookies.set("auth", token, cookieOptions);
    response.cookies.set("user_id", user.id, cookieOptions);
    response.cookies.set("role", "user_umkm", cookieOptions);
    response.cookies.set("session_created_at", String(Date.now()), cookieOptions);
    response.cookies.set("session_max_age", String(maxAge), cookieOptions);

    response.cookies.delete("google_register");

    return response;
  } catch (error) {
    console.error("GOOGLE REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registrasi Google gagal.",
      },
      {
        status: 500,
      },
    );
  }
}
