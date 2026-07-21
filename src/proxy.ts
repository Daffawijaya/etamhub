import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const adminCookie = req.cookies.get("admin")?.value;

  if (adminCookie !== "true") {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};