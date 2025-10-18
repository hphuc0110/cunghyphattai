import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { comparePassword, generateToken } from "@/lib/auth"

// POST /api/auth/login - Login user
export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password")
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = await generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: "Login successful",
    })
  } catch (error: any) {
    console.error("[v0] Error logging in:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to login",
      },
      { status: 500 },
    )
  }
}
