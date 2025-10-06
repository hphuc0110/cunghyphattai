import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { hashPassword } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Connecting to MongoDB...")
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email })
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    })

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully!",
      data: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error creating admin:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create admin user",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
