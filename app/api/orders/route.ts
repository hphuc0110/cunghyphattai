import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/lib/models/Order"
import Product from "@/lib/models/Product"

// Helper function to generate order ID
async function generateOrderId(): Promise<string> {
  const count = await Order.countDocuments()
  return `ORD-${String(count + 1).padStart(3, "0")}`
}

// GET /api/orders - Get all orders with filters
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const phone = searchParams.get("phone")
    const status = searchParams.get("status")
    const paymentStatus = searchParams.get("paymentStatus")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = (page - 1) * limit

    // Build query
    const query: any = {}

    // Filter by order ID
    if (orderId) {
      query.orderId = orderId
    }

    // Filter by phone
    if (phone) {
      query.customerPhone = phone
    }

    // Filter by status
    if (status) {
      query.status = status
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus
    }

    // Date range filter
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) {
        query.createdAt.$gte = new Date(startDate)
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate)
      }
    }

    // Execute query with pagination
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("items.product").lean(),
      Order.countDocuments(query),
    ])

    return NextResponse.json({
      success: true,
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST /api/orders - Create new order
export async function POST(request: Request) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate required fields
    const requiredFields = ["customerName", "customerPhone", "deliveryAddress", "items", "paymentMethod"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, error: "Order must have at least one item" }, { status: 400 })
    }

    // Generate order ID
    const orderId = await generateOrderId()

    // Process items and create snapshots
    const orderItems = await Promise.all(
      body.items.map(async (item: any) => {
        const product = await Product.findById(item.product.id || item.product._id)
        if (!product) {
          throw new Error(`Product not found: ${item.product.id || item.product._id}`)
        }

        return {
          product: product._id,
          productName: product.name,
          productPrice: product.price,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        }
      }),
    )

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0)
    const deliveryFee = body.deliveryFee || 20000
    const total = subtotal + deliveryFee

    // Create order
    const order = await Order.create({
      orderId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      deliveryAddress: body.deliveryAddress,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: "pending",
      paymentMethod: body.paymentMethod,
      paymentStatus: "pending",
      specialInstructions: body.specialInstructions,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 minutes from now
    })

    // Populate product details for response
    await order.populate("items.product")

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: "Order created successfully",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create order",
      },
      { status: 500 },
    )
  }
}
