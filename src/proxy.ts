import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;
  const role = req.cookies.get("role")?.value;

  if (!auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (role !== "super_admin" && role !== "admin_kecamatan") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
