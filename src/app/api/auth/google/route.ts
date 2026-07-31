import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, email, name, avatar } = body;

    if (!id || !email) {
      return NextResponse.json(
        {
          message: "Data Google tidak lengkap",
        },
        {
          status: 400,
        },
      );
    }

    const { data: existingUser, error: findError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      return NextResponse.json(
        {
          message: findError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!existingUser) {
      const cookieStore = await cookies();

      cookieStore.set(
        "google_register",
        JSON.stringify({
          id,
          email,
          name,
          avatar,
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 10,
          path: "/",
        },
      );

      return NextResponse.json({
        register_required: true,
      });
    }

    const cookieStore = await cookies();

    cookieStore.set("user_id", existingUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    cookieStore.set("role_id", existingUser.role_id ?? "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      role_id: existingUser.role_id,
    });
  } catch (error) {
    console.error("GOOGLE AUTH ERROR:", error);

    return NextResponse.json(
      {
        message: "Google authentication gagal",
      },
      {
        status: 500,
      },
    );
  }
}
