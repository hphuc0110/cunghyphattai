import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Category from "@/lib/models/Category"
import { requireAdmin } from "@/lib/auth-helpers"

// PATCH /api/categories/[id] - Update category (Admin only)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request)
    await connectDB()

    const body = await request.json()
    const { id } = params

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Category updated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error updating category:", error)

    if (error.message === "Authentication required" || error.message === "Admin access required") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update category",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/categories/[id] - Delete category (Admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(request)
    await connectDB()

    const { id } = params

    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error deleting category:", error)

    if (error.message === "Authentication required" || error.message === "Admin access required") {
      return NextResponse.json({ success: false, error: error.message }, { status: 401 })
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete category",
      },
      { status: 500 },
    )
  }
}
