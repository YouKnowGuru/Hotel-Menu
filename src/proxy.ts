import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // NextAuth's own routes manage authentication themselves.
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Session cookie names differ by NextAuth version and protocol:
  // v5 → authjs.session-token, v4 → next-auth.session-token (both with
  // __Secure- prefixed variants over HTTPS).
  const token =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Protect every other API route; each handler still performs its own
  // session check, so this is defense-in-depth rather than the only gate.
  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/templates") || pathname.startsWith("/api/contact")) {
      return NextResponse.next();
    }
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isPublicPage = ["/", "/login", "/register", "/templates", "/pricing", "/forgot-password", "/reset-password", "/about", "/contact"].includes(pathname);
  const isStaticFile = pathname.startsWith("/_next") || pathname.startsWith("/public");

  if (isPublicPage || isStaticFile) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
