import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/server/adminAuth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (pathname === "/admin/login" || pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await verifySessionToken(token))) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "অননুমোদিত — আগে লগইন করুন" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Public pages: forward the current pathname so Server Components can read it
  // via headers() to resolve per-page landing-lock (restricted navigation) state.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
