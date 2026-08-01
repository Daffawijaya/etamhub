import { NextResponse } from "next/server";
import crypto from "crypto";
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

    // Jika username ditemukan di tabel admins
    if (admin) {
      // =========================
      // CEK STATUS ADMIN
      // =========================
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

      // =========================
      // CEK PASSWORD ADMIN
      // =========================
      if (admin.password !== password) {
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

      // =========================
      // AMBIL ROLE ADMIN
      // =========================
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

      const user = {
        id: admin.id,
        nama: admin.nama,
      };

      // =========================
      // BUAT TOKEN ADMIN
      // =========================
      const token = crypto.randomBytes(32).toString("hex");

      const response = NextResponse.json({
        success: true,
        role,
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
      response.cookies.set("role", role, cookieOptions);

      console.log("LOGIN ADMIN BERHASIL:", {
        id: user.id,
        nama: user.nama,
        role,
      });

      // PENTING:
      // Admin berhasil → langsung return.
      // Jangan lanjut ke tabel users.
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
        password,
        email
        `,
      )
      .or(`nik.eq.${login},email.eq.${login}`)
      .maybeSingle();

    console.log("CEK USER UMKM:", {
      login,
      normalUser,
      error: userError,
    });

    if (userError) {
      throw userError;
    }

    // User tidak ditemukan
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

    // =========================
    // CEK PASSWORD USER UMKM
    // =========================
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

    // =========================
    // ROLE USER UMKM
    // =========================
    const role = "user_umkm";

    const user = {
      id: normalUser.id,
      nama: normalUser.email,
    };

    // =========================
    // BUAT TOKEN USER
    // =========================
    const token = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({
      success: true,
      role,
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
    response.cookies.set("role", role, cookieOptions);

    console.log("LOGIN USER UMKM BERHASIL:", {
      id: user.id,
      nama: user.nama,
      role,
    });

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
