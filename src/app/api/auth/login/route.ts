import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    let user: any = null;
    let role: string | null = null;
    let role_id: string | null = null;

    // =========================
    // CEK ADMIN
    // =========================
    const { data: admin } = await supabaseAdmin
      .from("admins")
      .select(
        `
        id,
        username,
        password,
        nama,
        role_id,
        roles (
          name
        )
      `,
      )
      .eq("username", login)
      .maybeSingle();

    if (admin) {
      if (admin.password !== password) {
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

      const roleData = admin.roles as
        | { name: string }
        | { name: string }[]
        | null;

      role = Array.isArray(roleData)
        ? (roleData[0]?.name ?? null)
        : (roleData?.name ?? null);

      user = {
        id: admin.id,
        nama: admin.nama,
      };

      role_id = admin.role_id;
    }

    // =========================
    // CEK USER
    // =========================
    if (!user) {
      const { data: normalUser } = await supabaseAdmin
        .from("users")
        .select(
          `
          id,
          nik,
          password,
          nama,
          role_id,
          roles (
            name
          )
        `,
        )
        .eq("nik", login)
        .maybeSingle();

      if (!normalUser) {
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

      if (normalUser.password !== password) {
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

      const roleData = normalUser.roles as
        | { name: string }
        | { name: string }[]
        | null;

      role = Array.isArray(roleData)
        ? (roleData[0]?.name ?? null)
        : (roleData?.name ?? null);

      user = {
        id: normalUser.id,
        nama: normalUser.nama,
      };

      role_id = normalUser.role_id;
    }

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
      role_id,
      user,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set("auth", token, cookieOptions);
    response.cookies.set("user_id", user.id, cookieOptions);
    response.cookies.set("role_id", role_id ?? "", cookieOptions);
    response.cookies.set("role", role, cookieOptions);

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
