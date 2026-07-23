import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const admin = req.cookies.get("admin")?.value;

  if (!admin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
