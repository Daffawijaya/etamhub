import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(
        `
        id,
        nama,
        username,
        nik,
        roles (
          name
        ),
        user_kecamatan (
          kecamatan (
            nama
          )
        )
      `,
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nama, username, password, role, kecamatanIds } = body;

    // ambil role id
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("name", role)
      .single();

    if (roleError || !roleData) {
      return NextResponse.json(
        {
          message: "Role tidak ditemukan",
        },
        {
          status: 400,
        },
      );
    }

    // buat user
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        nama,
        username,
        password,
        role_id: roleData.id,
      })
      .select()
      .single();

    if (userError) {
      return NextResponse.json(
        {
          message: userError.message,
        },
        {
          status: 500,
        },
      );
    }

    // kalau admin kecamatan
    // simpan wilayah akses

    if (role === "admin_kecamatan" && kecamatanIds?.length) {
      const mapping = kecamatanIds.map((id: string) => ({
        user_id: user.id,
        kecamatan_id: id,
      }));

      const { error: mappingError } = await supabaseAdmin
        .from("user_kecamatan")
        .insert(mapping);

      if (mappingError) {
        return NextResponse.json(
          {
            message: mappingError.message,
          },
          {
            status: 500,
          },
        );
      }
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
