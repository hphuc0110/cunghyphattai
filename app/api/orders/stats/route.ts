import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Order from "@/lib/models/Order"

// GET /api/orders/stats - Get order statistics (Admin only)
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "today" // today, week, month, year

    // Calculate date range
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    // Get statistics
    const [totalOrders, totalRevenue, ordersByStatus, recentOrders] = await Promise.all([
      // Total orders in period
      Order.countDocuments({
        createdAt: { $gte: startDate },
      }),

      // Total revenue (only completed and paid orders)
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: "completed",
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
          },
        },
      ]),

      // Orders by status
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Recent orders
      Order.find({
        createdAt: { $gte: startDate },
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("items.product")
        .lean(),
    ])

    // Format orders by status
    const statusCounts = ordersByStatus.reduce(
      (acc, item) => {
        acc[item._id] = item.count
        return acc
      },
      {} as Record<string, number>,
    )

    return NextResponse.json({
      success: true,
      data: {
        period,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        ordersByStatus: statusCounts,
        recentOrders,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching order stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch order statistics" }, { status: 500 })
  }
}
