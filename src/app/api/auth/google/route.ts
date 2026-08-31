import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email Google tidak ditemukan.",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // CEK USER
    // =========================
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select(
        `
        id,
        email
        `,
      )
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // =========================
    // USER BELUM TERDAFTAR
    // =========================
    if (!user) {
      const cookieStore = await cookies();

      cookieStore.set(
        "google_register",
        JSON.stringify({
          email,
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 10,
        },
      );

      return NextResponse.json({
        success: true,
        register_required: true,
      });
    }

    // =========================
    // LOGIN USER
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

    return response;
  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Login Google gagal.",
      },
      {
        status: 500,
      },
    );
  }
}
