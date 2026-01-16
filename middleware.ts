import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /api/admin/* routes (except auth)
  // The admin pages use client-side auth check
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    const authCookie = request.cookies.get("admin_auth");

    if (authCookie?.value !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
