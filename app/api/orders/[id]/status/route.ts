import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/lib/models/Order"
import { isValidObjectId } from "mongoose"

// PATCH /api/orders/[id]/status - Update order status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivering", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    let order

    // Check if ID is MongoDB ObjectId or orderId (ORD-XXX)
    if (isValidObjectId(params.id)) {
      order = await Order.findByIdAndUpdate(
        params.id,
        {
          $set: { status },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate("items.product")
    } else {
      order = await Order.findOneAndUpdate(
        { orderId: params.id },
        {
          $set: { status },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate("items.product")
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`,
    })
  } catch (error: any) {
    console.error("[v0] Error updating order status:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update order status",
      },
      { status: 500 },
    )
  }
}
