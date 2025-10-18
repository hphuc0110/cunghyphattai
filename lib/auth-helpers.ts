import type { NextRequest } from "next/server"
import { verifyToken } from "./auth"

export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authenticated: false, error: "No token provided" }
  }

  const token = authHeader.substring(7)

  try {
    const decoded = await verifyToken(token)

    if (!decoded) {
      return { authenticated: false, error: "Invalid or expired token" }
    }

    return { authenticated: true, user: decoded }
  } catch (error) {
    return { authenticated: false, error: "Invalid token" }
  }
}

export async function requireAuth(request: NextRequest) {
  const auth = await authenticateRequest(request)

  if (!auth.authenticated) {
    throw new Error(auth.error || "Authentication required")
  }

  return auth.user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)

  if (!user || user.role !== "admin") {
    throw new Error("Admin access required")
  }

  return user
}
