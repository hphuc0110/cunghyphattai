import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/lib/models/Product"
import { isValidObjectId } from "mongoose"

// PATCH /api/products/bulk - Bulk update products (Admin only)
export async function PATCH(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { ids, updates } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid product IDs" }, { status: 400 })
    }

    // Validate all IDs
    for (const id of ids) {
      if (!isValidObjectId(id)) {
        return NextResponse.json({ success: false, error: `Invalid product ID: ${id}` }, { status: 400 })
      }
    }

    // Bulk update
    const result = await Product.updateMany({ _id: { $in: ids } }, { $set: updates })

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount,
    })
  } catch (error: any) {
    console.error("[v0] Error bulk updating products:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to bulk update products",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/products/bulk - Bulk delete products (Admin only)
export async function DELETE(request: Request) {
  try {
    await connectDB()

    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid product IDs" }, { status: 400 })
    }

    // Validate all IDs
    for (const id of ids) {
      if (!isValidObjectId(id)) {
        return NextResponse.json({ success: false, error: `Invalid product ID: ${id}` }, { status: 400 })
      }
    }

    // Bulk delete
    const result = await Product.deleteMany({ _id: { $in: ids } })

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} products`,
      deletedCount: result.deletedCount,
    })
  } catch (error: any) {
    console.error("[v0] Error bulk deleting products:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to bulk delete products",
      },
      { status: 500 },
    )
  }
}
