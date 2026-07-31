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

    if (!admin) {
      return NextResponse.json(
        {
          message: "User tidak ditemukan",
        },
        {
          status: 404,
        },
      );
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
