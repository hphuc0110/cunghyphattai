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

    // Build current maps to support swap logic and avoid unique collisions
    const existing = await Category.find({}).select("_id order").lean()
    const idToOrder = new Map<string, number>()
    const orderToId = new Map<number, string>()
    let maxOrder = 0

    for (const doc of existing as Array<{ _id: any; order: number }>) {
      const idStr = String(doc._id)
      idToOrder.set(idStr, doc.order)
      orderToId.set(doc.order, idStr)
      if (doc.order > maxOrder) maxOrder = doc.order
    }

    let tempOrder = maxOrder + 1000

    for (const cat of categories as Array<{ id: string; order: number }>) {
      const desired = cat.order
      const current = idToOrder.get(cat.id)
      if (current === undefined || current === desired) continue

      const holderId = orderToId.get(desired)
      if (holderId && holderId !== cat.id) {
        // Move holder to temp, place desired, then move holder to current
        await Category.updateOne({ _id: holderId }, { $set: { order: tempOrder } })
        await Category.updateOne({ _id: cat.id }, { $set: { order: desired } })
        await Category.updateOne({ _id: holderId }, { $set: { order: current } })

        // Update maps
        orderToId.delete(current)
        orderToId.set(desired, cat.id)
        orderToId.set(current, holderId)
        idToOrder.set(cat.id, desired)
        idToOrder.set(holderId, current)

        tempOrder++
      } else {
        await Category.updateOne({ _id: cat.id }, { $set: { order: desired } })

        // Update maps
        if (current !== undefined) orderToId.delete(current)
        orderToId.set(desired, cat.id)
        idToOrder.set(cat.id, desired)
      }
    }

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
