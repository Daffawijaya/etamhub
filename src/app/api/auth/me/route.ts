import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface AuthUser {
  id: string;
  nama: string;
  roles: {
    name: string;
  } | null;
  user_kecamatan: {
    kecamatan: {
      id: string;
      nama: string;
    } | null;
  }[];
}

export async function GET() {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("user_id")?.value;

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

    const { data, error } = await supabaseAdmin
      .from("users")
      .select(
        `
        id,
        nama,
        roles (
          name
        ),
        user_kecamatan (
          kecamatan (
            id,
            nama
          )
        )
        `,
      )
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    const user = data as unknown as AuthUser;

    console.log("USER RAW:", JSON.stringify(user, null, 2));

    return NextResponse.json({
      id: user.id,
      nama: user.nama,
      role: user.roles?.name ?? null,
      kecamatan:
        user.user_kecamatan?.map((item) => item.kecamatan).filter(Boolean) ??
        [],
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
