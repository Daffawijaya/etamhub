import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const createdAt = cookieStore.get("session_created_at")?.value;
    const maxAge = cookieStore.get("session_max_age")?.value;
    const auth = cookieStore.get("auth")?.value;

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!createdAt || !maxAge) {
      // Legacy session without expiry tracking, treat as expired
      return NextResponse.json({
        createdAt: 0,
        maxAge: 0,
      });
    }

    return NextResponse.json({
      createdAt: parseInt(createdAt, 10),
      maxAge: parseInt(maxAge, 10),
    });
  } catch {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
