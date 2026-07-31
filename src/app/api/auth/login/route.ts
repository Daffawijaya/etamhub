import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    console.log("LOGIN:", login);

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select(
        `
        id,
        username,
        nik,
        password,
        nama,
        role_id,
        roles (
          name
        )
      `,
      )
      .or(`username.eq.${login},nik.eq.${login}`)
      .single();

    console.log("USER DATA:", user);
    console.log("SUPABASE ERROR:", error);

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username/NIK atau password salah",
        },
        {
          status: 401,
        },
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username/NIK atau password salah",
        },
        {
          status: 401,
        },
      );
    }

    const roleData = user.roles as unknown as
      | { name: string }
      | { name: string }[]
      | null;

    const role = Array.isArray(roleData) ? roleData[0]?.name : roleData?.name;

    if (!role) {
      return NextResponse.json(
        {
          success: false,
          message: "Role user tidak ditemukan",
        },
        {
          status: 403,
        },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({
      success: true,
      role,
      role_id: user.role_id,
      user: {
        id: user.id,
        nama: user.nama,
      },
    });

    response.cookies.set("auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("role_id", user.role_id ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set("role", role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("LOGIN BERHASIL:", user.nama, role);

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
