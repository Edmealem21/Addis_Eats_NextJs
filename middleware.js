import { NextResponse } from "next/server";

const COOKIE_NAME = "session";

export function middleware(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout", "/orders", "/orders/:path*"],
};