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
    const requiredFields = ["name", "nameEn", "description", "image"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Auto-assign order if not provided or if it conflicts
    let order = body.order
    if (!order) {
      // Get the highest order value and add 1
      const lastCategory = await Category.findOne().sort({ order: -1 }).select('order')
      order = lastCategory ? lastCategory.order + 1 : 1
    } else {
      // Check if the order already exists
      const existingCategory = await Category.findOne({ order: order })
      if (existingCategory) {
        // Shift all categories with order >= the new order
        await Category.updateMany(
          { order: { $gte: order } },
          { $inc: { order: 1 } }
        )
      }
    }

    // Create category with the determined order
    const category = await Category.create({
      ...body,
      order: order
    })

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
