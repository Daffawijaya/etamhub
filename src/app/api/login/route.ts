import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
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

    return response;
  } catch (error) {
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
