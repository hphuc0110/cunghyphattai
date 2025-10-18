import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/auth/me - Get current user
export async function GET(request: Request) {
  try {
    await connectDB()

    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get full user data
    const userData = await User.findById(user.userId).select("-password")
    if (!userData) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error("[v0] Error getting current user:", error)
    return NextResponse.json({ success: false, error: "Failed to get user" }, { status: 500 })
  }
}
