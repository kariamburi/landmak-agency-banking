import { NextRequest, NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "agency_admin_token";

export function middleware(req: NextRequest) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin/agency");
    const isLoginRoute = req.nextUrl.pathname === "/login";

    const authenticated = Boolean(req.cookies.get(ADMIN_TOKEN_COOKIE)?.value);

    if (isAdminRoute && !authenticated) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isLoginRoute && authenticated) {
        return NextResponse.redirect(new URL("/admin/agency", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/agency/:path*", "/login"],
};