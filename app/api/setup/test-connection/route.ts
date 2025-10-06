import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import mongoose from "mongoose"

export async function GET() {
  try {
    console.log("[v0] Testing MongoDB connection...")
    await connectDB()

    const dbState = mongoose.connection.readyState
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }

    return NextResponse.json({
      success: true,
      message: "MongoDB connection successful!",
      data: {
        status: states[dbState as keyof typeof states],
        database: mongoose.connection.name,
        host: mongoose.connection.host,
      },
    })
  } catch (error: any) {
    console.error("[v0] MongoDB connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
