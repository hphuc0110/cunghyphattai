import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export async function generateToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(JWT_SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
    console.error("[v0] Token verification failed:", error)
    return null
  }
}

// Get user from request
export async function getUserFromRequest(request: Request): Promise<any> {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)
    return payload
  } catch (error) {
    console.error("[v0] Error getting user from request:", error)
    return null
  }
}

// Check if user is admin
export function isAdmin(user: any): boolean {
  return user && user.role === "admin"
}

export async function verifyAuth(request: Request): Promise<{ isValid: boolean; user: any }> {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isValid: false, user: null }
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    if (!payload) {
      return { isValid: false, user: null }
    }

    return { isValid: true, user: payload }
  } catch (error) {
    console.error("[v0] Error verifying auth:", error)
    return { isValid: false, user: null }
  }
}
