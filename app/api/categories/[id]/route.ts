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

    // Handle order conflicts if order is being updated - perform swap when duplicated
    if (body.order !== undefined) {
      const targetOrder: number = body.order
      const conflicting = await Category.findOne({ order: targetOrder, _id: { $ne: id } })

      if (conflicting) {
        // Get current order of the category being updated
        const currentCategory = await Category.findById(id).select("order")
        const currentOrder = currentCategory?.order

        if (currentOrder !== undefined && currentOrder !== targetOrder) {
          // Use a safe temporary order value to avoid unique index conflicts
          const maxOrderDoc = await Category.findOne().sort({ order: -1 }).select("order")
          let tempOrder = (maxOrderDoc?.order ?? 0) + 1000

          // Move conflicting category to temporary slot, set new order, then move conflicting to old slot
          await Category.updateOne({ _id: conflicting._id }, { $set: { order: tempOrder } })
          await Category.updateOne({ _id: id }, { $set: { order: targetOrder } })
          await Category.updateOne({ _id: conflicting._id }, { $set: { order: currentOrder } })

          // Avoid re-updating order again below; strip order from body while keeping other fields
          const { order, ...rest } = body
          const swappedCategory = await Category.findByIdAndUpdate(id, rest, {
            new: true,
            runValidators: true,
          })

          if (!swappedCategory) {
            return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
          }

          return NextResponse.json({
            success: true,
            data: swappedCategory,
            message: "Category updated successfully",
          })
        }
      }
    }

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

    // Get the category to be deleted to know its order
    const categoryToDelete = await Category.findById(id).select('order')
    if (!categoryToDelete) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    const deletedOrder = categoryToDelete.order

    // Delete the category
    await Category.findByIdAndDelete(id)

    // Shift down all categories with order greater than the deleted category's order
    await Category.updateMany(
      { order: { $gt: deletedOrder } },
      { $inc: { order: -1 } }
    )

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
