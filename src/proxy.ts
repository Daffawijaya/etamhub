import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;
  const role = req.cookies.get("role")?.value;

  const pathname = req.nextUrl.pathname;

  if (!auth || !role) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!['super_admin', 'admin', 'admin_kecamatan'].includes(role ?? '')) {
      return NextResponse.redirect(new URL("/user", req.url));
    }
  }

  if (pathname.startsWith("/user")) {
    if (role !== "user_umkm") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
