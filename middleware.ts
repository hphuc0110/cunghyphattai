import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Get token from cookie or header
    const token = request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.substring(7)

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    // Verify token
    const payload = await verifyToken(token)
    if (!payload) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    // Check if user is admin
    if (payload.role !== "admin") {
      // Redirect to home if not admin
      return NextResponse.redirect(new URL("/?error=unauthorized", request.url))
    }
  }

  // Protect API routes that require authentication
  if (pathname.startsWith("/api/")) {
    // Admin-only API routes
    const adminRoutes = ["/api/products", "/api/categories", "/api/orders/stats"]

    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

    if (isAdminRoute && request.method !== "GET") {
      // Check authentication for non-GET requests
      const authHeader = request.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const payload = await verifyToken(token)

      if (!payload) {
        return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
      }

      // Check if user is admin for admin routes
      if (payload.role !== "admin") {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
