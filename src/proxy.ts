import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const isAdmin = req.cookies.get("admin")?.value === "true";

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
