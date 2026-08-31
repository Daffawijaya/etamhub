import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const auth = req.cookies.get("auth")?.value;
  const role = req.cookies.get("role")?.value;
  const sessionId = req.cookies.get("session_created_at")?.value;
  const sessionMaxAge = req.cookies.get("session_max_age")?.value;

  const pathname = req.nextUrl.pathname;

  if (!auth || !role) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Server-side session expiration check
  if (sessionId && sessionMaxAge) {
    const createdAt = parseInt(sessionId, 10);
    const maxAgeMs = parseInt(sessionMaxAge, 10) * 1000;
    const now = Date.now();

    if (!isNaN(createdAt) && !isNaN(maxAgeMs) && now - createdAt > maxAgeMs) {
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.delete("auth");
      response.cookies.delete("user_id");
      response.cookies.delete("role");
      response.cookies.delete("session_created_at");
      response.cookies.delete("session_max_age");
      return response;
    }
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
