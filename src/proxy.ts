import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const admin = req.cookies.get("admin")?.value;

  console.log("PATH:", req.nextUrl.pathname);
  console.log("ADMIN COOKIE:", admin);

  if (
    req.nextUrl.pathname.startsWith("/admin") &&
    admin !== "true"
  ) {
    console.log("REDIRECT LOGIN");

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};