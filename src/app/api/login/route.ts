import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("admin", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1 jam
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

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
