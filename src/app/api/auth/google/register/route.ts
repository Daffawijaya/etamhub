import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const USER_ROLE_ID = "4cf1951b-f2b5-42b3-a1d1-dc3810ad4da3";

export async function POST(req: Request) {
  try {
    const { nik, password } = await req.json();

    if (!nik || !password) {
      return NextResponse.json(
        {
          message: "NIK dan password wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    const cookieStore = await cookies();

    const googleData = cookieStore.get("google_register")?.value;

    if (!googleData) {
      return NextResponse.json(
        {
          message: "Data Google tidak ditemukan",
        },
        {
          status: 400,
        },
      );
    }

    const google = JSON.parse(decodeURIComponent(googleData));

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

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert({
        id: crypto.randomUUID(),
        nik,
        password,
        email: google.email,
        nama: google.name,
        avatar_url: google.avatar,
        provider: "google",
        role_id: USER_ROLE_ID,
        is_active: true,
        supabase_auth_id: google.id,
        email_verified_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      console.error("GOOGLE REGISTER ERROR:", error);

      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    cookieStore.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("role_id", user.role_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.delete("google_register");

    return NextResponse.json({
      success: true,
      role_id: user.role_id,
    });
  } catch (error) {
    console.error("GOOGLE REGISTER ERROR:", error);

    return NextResponse.json(
      {
        message: "Registrasi Google gagal",
      },
      {
        status: 500,
      },
    );
  }
}
