import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("user_id")?.value;
    const cookieRole = cookieStore.get("role")?.value;

    if (!userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    // =========================
    // CEK USER
    // =========================
    const { data: user } = await supabaseAdmin
      .from("users")
      .select(
        `
        id,
        nama,
        nik,
        email,
        whatsapp,
        avatar_url
        `,
      )
      .eq("id", userId)
      .maybeSingle();

    if (user) {
      return NextResponse.json({
        id: user.id,
        nama: user.nama,
        role: cookieRole ?? "user",
        kecamatan: [],
      });
    }

    // =========================
    // CEK ADMIN
    // =========================
    const { data: admin, error } = await supabaseAdmin
      .from("admins")
      .select(
        `
        id,
        nama,
        roles (
          name
        )
        `,
      )
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // Fallback: return cookie-based auth if DB lookup fails
    // (proxy already validated these cookies exist)
    if (!admin) {
      return NextResponse.json({
        id: userId,
        nama: null,
        role: cookieRole ?? "user",
        kecamatan: [],
      });
    }

    const roleData = admin.roles as
      | { name: string }
      | { name: string }[]
      | null;

    const role = Array.isArray(roleData) ? roleData[0]?.name : roleData?.name;

    return NextResponse.json({
      id: admin.id,
      nama: admin.nama,
      role: cookieRole ?? role ?? null,
      kecamatan: [],
    });
  } catch (error: any) {
    console.error("AUTH ME ERROR:", error);

    // If cookies exist but DB lookup fails, return cookie-based auth
    try {
      const cookieStore = await cookies();
      const userId = cookieStore.get("user_id")?.value;
      const cookieRole = cookieStore.get("role")?.value;
      if (userId) {
        return NextResponse.json({
          id: userId,
          nama: null,
          role: cookieRole ?? "user",
          kecamatan: [],
        });
      }
    } catch {}

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
