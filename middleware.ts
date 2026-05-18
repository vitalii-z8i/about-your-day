import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/register"];
const PROTECTED_PREFIX = "/chats";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isProtected = pathname.startsWith(PROTECTED_PREFIX);

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/chats", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chats/:path*", "/login", "/register"],
};
