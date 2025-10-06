import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/lib/models/Order"
import { isValidObjectId } from "mongoose"

// GET /api/orders/[id] - Get single order
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    let order

    // Check if ID is MongoDB ObjectId or orderId (ORD-XXX)
    if (isValidObjectId(params.id)) {
      order = await Order.findById(params.id).populate("items.product").lean()
    } else {
      order = await Order.findOne({ orderId: params.id }).populate("items.product").lean()
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("[v0] Error fetching order:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 })
  }
}

// PATCH /api/orders/[id] - Update order
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const body = await request.json()

    let order

    // Check if ID is MongoDB ObjectId or orderId (ORD-XXX)
    if (isValidObjectId(params.id)) {
      order = await Order.findByIdAndUpdate(
        params.id,
        {
          $set: body,
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
          $set: body,
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
      message: "Order updated successfully",
    })
  } catch (error: any) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update order",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/orders/[id] - Delete order (Admin only)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    let order

    // Check if ID is MongoDB ObjectId or orderId (ORD-XXX)
    if (isValidObjectId(params.id)) {
      order = await Order.findByIdAndDelete(params.id)
    } else {
      order = await Order.findOneAndDelete({ orderId: params.id })
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error deleting order:", error)
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 })
  }
}
