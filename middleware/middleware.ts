import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
    "/superadmin",
  "/admin",
  "/attendant",
];

export function middleware(request: NextRequest) {

  const accessToken = request.cookies.get("accessToken");

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !accessToken) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/attendant/:path*", "/superadmin/:path*"],
};