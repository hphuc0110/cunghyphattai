import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import { verifyAuth } from "@/lib/auth"

// POST /api/categories/reorder - Bulk update category order
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request)
    if (!authResult.isValid || authResult.user?.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { categories } = await request.json()

    if (!Array.isArray(categories)) {
      return NextResponse.json({ success: false, error: "Invalid categories data" }, { status: 400 })
    }

    // Bulk update category orders
    const updatePromises = categories.map((cat: { id: string; order: number }) =>
      Category.findByIdAndUpdate(cat.id, { order: cat.order }, { new: true }),
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: "Category order updated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error reordering categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to reorder categories",
      },
      { status: 500 },
    )
  }
}
