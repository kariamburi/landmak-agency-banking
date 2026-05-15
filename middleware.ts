import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "agency_admin_token";

export function middleware(req: NextRequest) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginRoute = req.nextUrl.pathname === "/login";

    const authenticated = Boolean(req.cookies.get(ADMIN_TOKEN_COOKIE)?.value);

    if (isAdminRoute && !authenticated) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isLoginRoute && authenticated) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};