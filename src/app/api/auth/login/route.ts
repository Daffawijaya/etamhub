import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();

    // =========================
    // CEK ADMIN
    // =========================
    const { data: admin, error: adminError } = await supabaseAdmin
      .from("admins")
      .select(
        `
        id,
        username,
        password,
        nama,
        role_id,
        is_active,
        roles (
          name
        )
        `,
      )
      .eq("username", login)
      .maybeSingle();

    if (adminError) {
      throw adminError;
    }

    if (admin) {
      if (!admin.is_active) {
        return NextResponse.json(
          {
            success: false,
            message: "Akun admin tidak aktif",
          },
          {
            status: 403,
          },
        );
      }

      // Fallback: admin password mungkin masih plaintext (belum di-hash)
      const isHashed = admin.password.startsWith("$2");
      const adminPasswordValid = isHashed
        ? await bcrypt.compare(password, admin.password)
        : password === admin.password;

      // Auto-hash plaintext password saat login berhasil
      if (!isHashed && adminPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 12);
        await supabaseAdmin
          .from("admins")
          .update({ password: hashedPassword })
          .eq("id", admin.id);
      }

      if (!adminPasswordValid) {
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

      const roleData = admin.roles as
        | { name: string }
        | { name: string }[]
        | null;

      const role = Array.isArray(roleData)
        ? (roleData[0]?.name ?? null)
        : (roleData?.name ?? null);

      if (!role) {
        return NextResponse.json(
          {
            success: false,
            message: "Role admin tidak ditemukan",
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
        user: {
          id: admin.id,
          nama: admin.nama,
        },
      });

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      };

      response.cookies.set("auth", token, cookieOptions);
      response.cookies.set("user_id", admin.id, cookieOptions);
      response.cookies.set("role", role, cookieOptions);

      return response;
    }

    // =========================
    // CEK USER UMKM
    // =========================
    const { data: normalUser, error: userError } = await supabaseAdmin
      .from("users")
      .select(
        `
        id,
        nik,
        email,
        password
        `,
      )
      .or(`nik.eq.${login},email.eq.${login}`)
      .maybeSingle();

    if (userError) {
      throw userError;
    }

    if (!normalUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/NIK atau password salah",
        },
        {
          status: 401,
        },
      );
    }

    const passwordValid = await bcrypt.compare(password, normalUser.password);

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Email/NIK atau password salah",
        },
        {
          status: 401,
        },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({
      success: true,
      role: "user_umkm",
      user: {
        id: normalUser.id,
        nama: normalUser.email,
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set("auth", token, cookieOptions);
    response.cookies.set("user_id", normalUser.id, cookieOptions);
    response.cookies.set("role", "user_umkm", cookieOptions);

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
