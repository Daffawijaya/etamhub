import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    console.log("LOGIN USERNAME:", username);

    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, username, password")
      .eq("username", username)
      .single();

    console.log("ADMIN DATA:", admin);
    console.log("SUPABASE ERROR:", error);

    if (error || !admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Username atau password salah",
        },
        {
          status: 401,
        },
      );
    }

    if (admin.password !== password) {
      console.log("PASSWORD TIDAK COCOK");

      return NextResponse.json(
        {
          success: false,
          message: "Username atau password salah",
        },
        {
          status: 401,
        },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    console.log("LOGIN BERHASIL:", username);

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan",
      },
      {
        status: 500,
      },
    );
  }
}
