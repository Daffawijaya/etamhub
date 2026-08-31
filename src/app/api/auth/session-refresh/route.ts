import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const auth = cookieStore.get("auth")?.value;
    const role = cookieStore.get("role")?.value;
    const userId = cookieStore.get("user_id")?.value;
    const currentMaxAge = cookieStore.get("session_max_age")?.value;

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const maxAge = currentMaxAge ? parseInt(currentMaxAge, 10) : 60 * 60 * 24;

    const response = NextResponse.json({ success: true });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge,
    };

    // Re-set existing cookies with fresh expiry
    if (userId) response.cookies.set("user_id", userId, cookieOptions);
    if (role) response.cookies.set("role", role, cookieOptions);
    response.cookies.set("auth", auth, cookieOptions);

    // Reset session timestamps
    response.cookies.set("session_created_at", String(Date.now()), cookieOptions);
    response.cookies.set("session_max_age", String(maxAge), cookieOptions);

    return response;
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
