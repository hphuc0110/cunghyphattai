import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    await connectDB()

    const categories = await Category.find({}).sort({ order: 1 }).lean()

    const categoriesWithId = categories.map((category: any) => ({
      ...category,
      id: category._id.toString(),
    }))

    return NextResponse.json({
      success: true,
      data: categoriesWithId,
    })
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "nameEn", "description", "image", "order"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create category
    const category = await Category.create(body)

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: "Category created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating category:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create category",
      },
      { status: 500 },
    )
  }
}
